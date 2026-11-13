import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { ApiError, createDb, createDuel, getDuel, join, leaderboard, submitDuel, sync } from './db';

const PORT = Number(process.env.PORT ?? 3101);
const db = createDb(process.env.DB_PATH ?? new URL('./data.sqlite', import.meta.url).pathname);

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

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > 2048) { reject(new ApiError(413, 'So‘rov juda katta')); req.destroy(); return; }
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
    const ip = req.socket.remoteAddress ?? 'x';
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
    if (url.pathname === '/api/health') return send(res, 200, { ok: true });
    return send(res, 404, { error: 'Topilmadi' });
  } catch (e) {
    if (e instanceof ApiError) return send(res, e.status, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Server xatosi' });
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Bandly API: http://127.0.0.1:${PORT}`));
