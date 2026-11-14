import { resolvePersona, coachTurn, once, MAX_HISTORY } from './coach';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { ApiError, byToken, createDb, createDuel, getDuel, join, leaderboard, submitDuel, sync, useAi, useGlobalAi } from './db';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './static';
import { dirname } from 'node:path';
import { hamyonApi, hamyonConfigFromEnv, verifySign } from './hamyon';
import { cancelPayment, createPayment, entitlements, findByCallback, grant, markPrepared, applyResult, reconcile, recent, statusFor } from './payments';
import { PERIODS, TRACKS, priceFor } from './pricing';
import { TTS_DAILY_LIMIT, TtsError, cleanText, synthesize, ttsConfigFromEnv } from './tts';
import { AiError, configFromEnv, evaluateSpeaking, evaluateWriting, followUp, followUpPersona } from './ai';

const PORT = Number(process.env.PORT ?? 3101);
const ai = configFromEnv();
// AI Coach limits (env). Global ceiling is FAIL-CLOSED: unset or 0 = coach disabled even with a key (owner decision OD-09).
const COACH_GLOBAL_DAILY = Number(process.env.AI_GLOBAL_DAILY_CALLS ?? 0);
const COACH_DAILY_LIMIT = Number(process.env.AI_COACH_DAILY_LIMIT ?? 30);
const HOST = process.env.HOST ?? (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const DB_FILE = process.env.DB_PATH ?? new URL('./data.sqlite', import.meta.url).pathname;
const db = createDb(DB_FILE);
const hcfg = hamyonConfigFromEnv();
const hapi = hcfg ? hamyonApi(hcfg) : null;
// Demo rejim (to'lovsiz yoqish) faqat to'lov ulanmaganda; PAY_DEMO=1 bilan majburan yoqish mumkin
const DEMO = process.env.PAY_DEMO ? process.env.PAY_DEMO === '1' : !hapi;
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN ?? '').trim();
const tts = ttsConfigFromEnv(process.env.TTS_CACHE_DIR ?? `${dirname(DB_FILE)}/tts-cache`);

// Oddiy so'rov tezligi cheklovi (IP bo'yicha, daqiqada 120 ta)
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { n: 1, reset: now + 60_000 }); return false; }
  return ++h.n > 120;
}

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};

/** Hamyon callbacklari: urlencoded, JSON yoki multipart/form-data maydonlari. */
function readForm(req: IncomingMessage, limit = 8192): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => { size += c.length; if (size > limit) { reject(new ApiError(413, 'So‘rov juda katta')); req.destroy(); return; } chunks.push(c); });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      const ct = String(req.headers['content-type'] ?? '');
      const out: Record<string, string> = {};
      if (ct.includes('json')) { try { for (const [k, v] of Object.entries(JSON.parse(raw || '{}') as Record<string, unknown>)) out[k] = String(v); } catch { reject(new ApiError(400, 'JSON xato')); return; } }
      else if (ct.includes('multipart')) { for (const m of raw.matchAll(/name="([^"]+)"\r?\n\r?\n([^\r\n]*)/g)) out[m[1]] = m[2]; }
      else for (const [k, v] of new URLSearchParams(raw)) out[k] = v;
      resolve(out);
    });
    req.on('error', reject);
  });
}

function readJson(req: IncomingMessage, limit = 2048): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) { reject(new ApiError(413, 'So‘rov juda katta')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { reject(new ApiError(400, 'JSON xato')); }
    });
    req.on('error', reject);
  });
}

createServer(async (req, res) => {
  try {
    // Proksi (Railway va boshqalar) orqasida haqiqiy IP birinchi X-Forwarded-For qiymatida
    const fwd = TRUST_PROXY ? String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() : '';
    const ip = fwd || (req.socket.remoteAddress ?? 'x');
    if (limited(ip)) return send(res, 429, { error: 'Juda ko‘p so‘rov' });
    const url = new URL(req.url ?? '/', 'http://x');
    if (req.method === 'POST' && url.pathname === '/api/join') {
      const b = await readJson(req);
      return send(res, 200, join(db, String(b.nickname ?? '')));
    }
    if (req.method === 'POST' && url.pathname === '/api/sync') {
      const b = await readJson(req);
      return send(res, 200, sync(db, String(b.token ?? ''), Number(b.xp), Number(b.streak)));
    }
    if (req.method === 'GET' && url.pathname === '/api/leaderboard') {
      const period = url.searchParams.get('period') === 'all' ? 'all' : 'week';
      const token = req.headers['x-token'];
      return send(res, 200, leaderboard(db, period, typeof token === 'string' ? token : undefined));
    }
    if (req.method === 'POST' && url.pathname === '/api/duel/create') {
      const b = await readJson(req);
      return send(res, 200, createDuel(db, String(b.token ?? '')));
    }
    const dm = url.pathname.match(/^\/api\/duel\/([A-Za-z0-9]{4,8})(\/submit)?$/);
    if (dm && req.method === 'GET' && !dm[2]) {
      const token = req.headers['x-token'];
      return send(res, 200, getDuel(db, dm[1], typeof token === 'string' ? token : undefined));
    }
    if (dm && req.method === 'POST' && dm[2]) {
      const b = await readJson(req);
      return send(res, 200, submitDuel(db, String(b.token ?? ''), dm[1], Number(b.score), Number(b.correct), Number(b.ms)));
    }
    if (req.method === 'GET' && url.pathname === '/api/ai/status') return send(res, 200, { enabled: ai.provider !== 'none', provider: ai.provider, coach: ai.provider !== 'none' && COACH_GLOBAL_DAILY > 0 });
    if (req.method === 'POST' && url.pathname === '/api/ai/coach') {
      if (ai.provider === 'none') throw new AiError(503, 'AI ustoz hali ulanmagan');
      const b = await readJson(req, 16_384);
      const token = String(b.token ?? '');
      const player = byToken(db, token);
      const turnId = String(b.turnId ?? '').slice(0, 64);
      if (!/^[\w-]{8,64}$/.test(turnId)) throw new ApiError(400, 'turnId kerak');
      const mode = b.mode === 'exam' ? 'exam' : 'practice';
      const resolved = resolvePersona(String(b.persona ?? 'friendly'), { adult: b.adult === true, mode }); // adult = learner's self-declaration (OD-06b pending)
      const history = Array.isArray(b.history) ? b.history.slice(-MAX_HISTORY).map((t) => ({ role: (t as { role?: unknown }).role === 'coach' ? 'coach' as const : 'learner' as const, text: String((t as { text?: unknown }).text ?? '') })) : [];
      const text = String(b.text ?? '');
      const reply = await once(`${player.id}:${turnId}`, async () => {
        useGlobalAi(db, COACH_GLOBAL_DAILY);                       // platform ceiling first (fail-closed)
        useAi(db, token, Date.now(), COACH_DAILY_LIMIT, 'coach');  // per-learner daily limit
        return coachTurn(ai, resolved.id, history, text, { level: typeof b.level === 'string' ? b.level : null, mode });
      });
      return send(res, 200, { ...reply, persona: resolved.id, notice: resolved.downgraded });
    }
    if (req.method === 'POST' && url.pathname.startsWith('/api/ai/')) {
      if (ai.provider === 'none') throw new AiError(503, 'AI yoqilmagan');
      const b = await readJson(req, 16_384);
      useAi(db, String(b.token ?? '')); // token va kunlik limit
      if (url.pathname === '/api/ai/followup') {
        const lv = Math.max(0, Math.min(3, Math.floor(Number(b.level) || 0)));
        if (lv === 0) return send(res, 200, { question: await followUp(ai, String(b.question ?? ''), String(b.answer ?? '')), reaction: null });
        return send(res, 200, await followUpPersona(ai, String(b.question ?? ''), String(b.answer ?? ''), lv as 1 | 2 | 3));
      }
      if (url.pathname === '/api/ai/speaking') {
        const turns = Array.isArray(b.turns) ? b.turns.slice(0, 12).map((t) => ({ q: String((t as { q?: unknown }).q ?? ''), text: String((t as { text?: unknown }).text ?? '') })) : [];
        if (!turns.some((t) => t.text.trim().length > 10)) throw new ApiError(400, 'Baholash uchun javoblar yetarli emas');
        return send(res, 200, await evaluateSpeaking(ai, turns));
      }
      if (url.pathname === '/api/ai/writing') {
        const text = String(b.text ?? '');
        if (text.trim().split(/\s+/).length < 30) throw new ApiError(400, 'Matn juda qisqa (kamida 30 so‘z)');
        return send(res, 200, await evaluateWriting(ai, Number(b.task) === 1 ? 1 : 2, String(b.prompt ?? ''), text));
      }
      return send(res, 404, { error: 'Topilmadi' });
    }
    if (req.method === 'GET' && url.pathname === '/api/tts/status') return send(res, 200, { enabled: tts.provider !== 'none', voice: tts.provider === 'none' ? null : tts.voice });
    if (req.method === 'POST' && url.pathname === '/api/tts') {
      if (tts.provider === 'none') throw new TtsError(503, 'Ovoz xizmati yoqilmagan');
      const b = await readJson(req, 2048);
      const text = cleanText(b.text);
      useAi(db, String(b.token ?? ''), Date.now(), TTS_DAILY_LIMIT, 'tts'); // token va kunlik limit
      const { audio, cached } = await synthesize(tts, text, { rate: Number(b.rate) || 1, pitch: Number(b.pitch) || 0 });
      res.writeHead(200, { 'content-type': 'audio/mpeg', 'content-length': audio.length, 'cache-control': 'private, max-age=86400', 'x-cache': cached ? 'hit' : 'miss' });
      return void res.end(audio);
    }
    // ---------------- To'lov (Hamyon) ----------------
    if (req.method === 'GET' && url.pathname === '/api/pay/config') {
      return send(res, 200, { enabled: !!hapi, demo: DEMO, periods: PERIODS.map((p) => ({ days: p.days, label: p.label, prices: Object.fromEntries(TRACKS.map((t) => [t, priceFor(t, p.days)])) })) });
    }
    if (req.method === 'GET' && url.pathname === '/api/me') return send(res, 200, entitlements(db, String(req.headers['x-token'] ?? '')));
    if (req.method === 'POST' && url.pathname === '/api/pay/create') {
      if (!hapi) throw new ApiError(503, 'To‘lov hali ulanmagan');
      const b = await readJson(req);
      return send(res, 200, await createPayment(db, hapi, String(b.token ?? ''), String(b.track ?? ''), Number(b.days)));
    }
    const ps = url.pathname.match(/^\/api\/pay\/(status|cancel)\/([a-f0-9]{8,40})$/);
    if (ps && req.method === (ps[1] === 'status' ? 'GET' : 'POST')) {
      const tok = String(req.headers['x-token'] ?? '');
      return send(res, 200, ps[1] === 'status' ? await statusFor(db, hapi, hcfg?.shopId ?? '', tok, ps[2]) : await cancelPayment(db, hapi, tok, ps[2]));
    }
    if (req.method === 'POST' && (url.pathname === '/api/pay/hamyon/prepare' || url.pathname === '/api/pay/hamyon/complete')) {
      if (!hcfg) throw new ApiError(503, 'To‘lov hali ulanmagan');
      const f = await readForm(req);
      if (!verifySign(hcfg, f)) { console.warn('Hamyon: imzo xato (order=%s)', f.order_id); return send(res, 403, { error: 'sign' }); }
      const p = findByCallback(db, f);
      if (url.pathname.endsWith('/prepare')) { if (p) markPrepared(db, p.id, f.payment_id); return send(res, 200, { result: 'ok' }); }
      if (!p) return send(res, 200, { result: 'ok' }); // qayta urinishni to'xtatish uchun 200
      const paid = f.status === 'paid';
      const amt = Math.round(Number(f.amount));
      console.log('Hamyon complete: order=%s status=%s amount=%s', p.id, f.status, f.amount);
      try { applyResult(db, p.id, paid ? 'paid' : 'cancel', { paidAmount: paid ? (Number.isFinite(amt) ? amt : -1) : undefined, reason: f.reason }); } catch (e) { console.error(e); return send(res, 500, { error: 'retry' }); }
      return send(res, 200, { result: 'ok' });
    }
    if (url.pathname.startsWith('/api/admin/')) {
      if (!ADMIN_TOKEN || String(req.headers['x-admin'] ?? '') !== ADMIN_TOKEN) throw new ApiError(403, 'Taqiqlangan');
      if (req.method === 'GET' && url.pathname === '/api/admin/payments') return send(res, 200, { payments: recent(db, 100) });
      if (req.method === 'POST' && url.pathname === '/api/admin/grant') { const b = await readJson(req); return send(res, 200, { until: grant(db, String(b.nickname ?? ''), String(b.track ?? ''), Number(b.days)) }); }
    }
    if (url.pathname === '/api/health') return send(res, 200, { ok: true });
    if (!url.pathname.startsWith('/api/') && serveStatic(req, res, DIST)) return;
    return send(res, 404, { error: 'Topilmadi' });
  } catch (e) {
    if (e instanceof ApiError || e instanceof AiError || e instanceof TtsError) return send(res, e.status, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Server xatosi' });
  }
}).listen(PORT, HOST, () => console.log(`Bandly: http://${HOST}:${PORT} (AI: ${ai.provider}, TTS: ${tts.provider}, To‘lov: ${hapi ? 'Hamyon' : 'yo‘q (demo)'})`));

// Yo'qolgan callbacklar uchun xavfsizlik to'ri: har 90 soniyada ochiq to'lovlar Hamyondan tekshiriladi
if (hapi && hcfg) setInterval(() => { reconcile(db, hapi, hcfg.shopId).then((n) => { if (n) console.log('Hamyon reconcile: %s ta to‘lov yakunlandi', n); }).catch((e) => console.warn('reconcile xato', e)); }, 90_000);
