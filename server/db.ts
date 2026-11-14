import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomInt } from 'node:crypto';
import { vocab } from '../src/content/vocab';

export const MAX_DELTA_PER_SYNC = 400; // bitta so'rovda qabul qilinadigan eng ko'p XP (aldovga qarshi)
export const MAX_DELTA_PER_HOUR = 1500;

export function createDb(path = ':memory:'): DatabaseSync {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      nickname TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS players_nick ON players (lower(nickname));
    CREATE TABLE IF NOT EXISTS xp_log (
      player_id INTEGER NOT NULL REFERENCES players(id),
      ts INTEGER NOT NULL,
      delta INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS xp_log_ts ON xp_log (ts);
    CREATE TABLE IF NOT EXISTS ai_global_usage (
      day TEXT PRIMARY KEY,
      calls INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS ai_usage (
      player_id INTEGER NOT NULL REFERENCES players(id),
      day TEXT NOT NULL,
      calls INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (player_id, day)
    );
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      player_id INTEGER NOT NULL REFERENCES players(id),
      track TEXT NOT NULL,
      days INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      hamyon_payment_id TEXT,
      hamyon_amount INTEGER,
      card TEXT,
      status TEXT NOT NULL,
      expire_at INTEGER,
      error TEXT,
      note TEXT,
      created_at INTEGER NOT NULL,
      paid_at INTEGER,
      checked_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS payments_player ON payments (player_id, created_at);
    CREATE INDEX IF NOT EXISTS payments_open ON payments (status, created_at);
    CREATE TABLE IF NOT EXISTS subscriptions (
      player_id INTEGER NOT NULL REFERENCES players(id),
      track TEXT NOT NULL,
      until INTEGER NOT NULL,
      PRIMARY KEY (player_id, track)
    );
    CREATE TABLE IF NOT EXISTS duels (
      code TEXT PRIMARY KEY,
      words TEXT NOT NULL,
      creator_id INTEGER NOT NULL REFERENCES players(id),
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS duel_players (
      code TEXT NOT NULL REFERENCES duels(code),
      player_id INTEGER NOT NULL REFERENCES players(id),
      score INTEGER,
      correct INTEGER,
      ms INTEGER,
      finished_at INTEGER,
      PRIMARY KEY (code, player_id)
    );
  `);
  return db;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const NICK_RE = /^[\p{L}\p{N}_.\- ]{2,20}$/u;

export function join(db: DatabaseSync, nickname: string, now = Date.now()): { token: string; nickname: string } {
  const nick = (nickname ?? '').trim().replace(/\s+/g, ' ');
  if (!NICK_RE.test(nick)) throw new ApiError(400, 'Laqab 2–20 belgi: harf, raqam, bo‘shliq, _ . -');
  const token = randomBytes(24).toString('hex');
  try {
    db.prepare('INSERT INTO players (token, nickname, created_at, updated_at) VALUES (?, ?, ?, ?)').run(token, nick, now, now);
  } catch {
    throw new ApiError(409, 'Bu laqab band');
  }
  return { token, nickname: nick };
}

export interface Player { id: number; nickname: string; xp: number; streak: number }

export const byToken = (db: DatabaseSync, token: string): Player => {
  const p = db.prepare('SELECT id, nickname, xp, streak FROM players WHERE token = ?').get(token ?? '') as Player | undefined;
  if (!p) throw new ApiError(401, 'Noma’lum token');
  return p;
};

/** Mijoz o'zining umumiy XP sini yuboradi; server faqat chegaralangan o'sishni qabul qiladi. */
export function sync(db: DatabaseSync, token: string, clientXp: number, streak: number, now = Date.now()): { xp: number; accepted: number } {
  const p = byToken(db, token);
  const claimed = Number.isFinite(clientXp) ? Math.max(0, Math.floor(clientXp)) : 0;
  let delta = Math.max(0, claimed - p.xp);
  const hourAgo = now - 3_600_000;
  const lastHour = (db.prepare('SELECT COALESCE(SUM(delta),0) AS s FROM xp_log WHERE player_id = ? AND ts > ?').get(p.id, hourAgo) as { s: number }).s;
  delta = Math.min(delta, MAX_DELTA_PER_SYNC, Math.max(0, MAX_DELTA_PER_HOUR - lastHour));
  const xp = p.xp + delta;
  const st = Number.isFinite(streak) ? Math.min(3650, Math.max(0, Math.floor(streak))) : p.streak;
  db.prepare('UPDATE players SET xp = ?, streak = ?, updated_at = ? WHERE id = ?').run(xp, st, now, p.id);
  if (delta > 0) db.prepare('INSERT INTO xp_log (player_id, ts, delta) VALUES (?, ?, ?)').run(p.id, now, delta);
  return { xp, accepted: delta };
}

/** Joriy haftaning boshi: dushanba 00:00 UTC */
export function weekStart(now: number): number {
  const d = new Date(now);
  const dow = (d.getUTCDay() + 6) % 7; // dushanba = 0
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow);
}

export interface Row { rank: number; nickname: string; xp: number; streak: number; me: boolean }

export function leaderboard(db: DatabaseSync, period: 'week' | 'all', token: string | undefined, now = Date.now()): { top: Row[]; me: Row | null; since: number | null } {
  const since = period === 'week' ? weekStart(now) : null;
  const rows = (period === 'week'
    ? db.prepare(`SELECT p.id, p.nickname, p.streak, p.token, SUM(l.delta) AS xp FROM xp_log l JOIN players p ON p.id = l.player_id WHERE l.ts >= ? GROUP BY p.id ORDER BY xp DESC, p.id ASC`).all(since)
    : db.prepare('SELECT id, nickname, streak, token, xp FROM players WHERE xp > 0 ORDER BY xp DESC, id ASC').all()) as { id: number; nickname: string; streak: number; token: string; xp: number }[];
  const ranked: Row[] = rows.map((r, i) => ({ rank: i + 1, nickname: r.nickname, xp: r.xp, streak: r.streak, me: !!token && r.token === token }));
  return { top: ranked.slice(0, 20), me: ranked.find((r) => r.me) ?? null, since };
}

// ---------------- Duel ----------------
export const DUEL_WORDS = 10;
export const DUEL_TTL = 48 * 3_600_000;
export const DUEL_MAX_PLAYERS = 8;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function createDuel(db: DatabaseSync, token: string, now = Date.now()): { code: string; words: string[] } {
  const p = byToken(db, token);
  const recent = (db.prepare('SELECT COUNT(*) AS n FROM duels WHERE creator_id = ? AND created_at > ?').get(p.id, now - 3_600_000) as { n: number }).n;
  if (recent >= 10) throw new ApiError(429, 'Soatiga 10 tadan ko‘p duel ochib bo‘lmaydi');
  const ids = vocab.map((w) => w.id);
  const words: string[] = [];
  while (words.length < DUEL_WORDS) {
    const id = ids[randomInt(ids.length)];
    if (!words.includes(id)) words.push(id);
  }
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
    try {
      db.prepare('INSERT INTO duels (code, words, creator_id, created_at) VALUES (?, ?, ?, ?)').run(code, JSON.stringify(words), p.id, now);
      db.prepare('INSERT INTO duel_players (code, player_id) VALUES (?, ?)').run(code, p.id);
      return { code, words };
    } catch { /* kod band, qayta uriniladi */ }
  }
  throw new ApiError(500, 'Kod yaratib bo‘lmadi');
}

export interface DuelInfo {
  code: string;
  words: string[];
  expired: boolean;
  full: boolean;
  players: { nickname: string; score: number | null; correct: number | null; ms: number | null; me: boolean; rank: number | null }[];
  iFinished: boolean;
}

export function getDuel(db: DatabaseSync, code: string, token: string | undefined, now = Date.now()): DuelInfo {
  const d = db.prepare('SELECT code, words, created_at FROM duels WHERE code = ?').get((code ?? '').toUpperCase()) as { code: string; words: string; created_at: number } | undefined;
  if (!d) throw new ApiError(404, 'Duel topilmadi');
  const rows = db.prepare(`SELECT p.nickname, p.token, dp.score, dp.correct, dp.ms FROM duel_players dp JOIN players p ON p.id = dp.player_id WHERE dp.code = ?
    ORDER BY (dp.score IS NULL), dp.score DESC, dp.ms ASC, dp.player_id ASC`).all(d.code) as { nickname: string; token: string; score: number | null; correct: number | null; ms: number | null }[];
  let rank = 0;
  const players = rows.map((r) => ({
    nickname: r.nickname, score: r.score, correct: r.correct, ms: r.ms,
    me: !!token && r.token === token, rank: r.score === null ? null : ++rank,
  }));
  return { code: d.code, words: JSON.parse(d.words) as string[], expired: now - d.created_at > DUEL_TTL, full: rows.length >= DUEL_MAX_PLAYERS, players, iFinished: players.some((p) => p.me && p.score !== null) };
}

export function submitDuel(db: DatabaseSync, token: string, code: string, score: number, correct: number, ms: number, now = Date.now()): DuelInfo {
  const p = byToken(db, token);
  const info = getDuel(db, code, token, now);
  if (info.expired) throw new ApiError(410, 'Duel muddati tugagan');
  if (info.iFinished) throw new ApiError(409, 'Siz allaqachon qatnashgansiz');
  const joined = info.players.some((x) => x.me);
  if (!joined && info.full) throw new ApiError(409, 'Duel to‘lgan');
  const c = Math.floor(correct), sc = Math.floor(score), t = Math.floor(ms);
  // Haqiqiy bo'lishi mumkin bo'lgan natijalar: har to'g'ri javob 100–150 ball, vaqt kamida 0.5 soniya/savol
  if (!(c >= 0 && c <= DUEL_WORDS) || !Number.isFinite(sc) || sc < c * 100 || sc > c * 150 || !(t >= DUEL_WORDS * 500 && t <= DUEL_WORDS * 60_000)) {
    throw new ApiError(400, 'Natija yaroqsiz');
  }
  if (!joined) db.prepare('INSERT INTO duel_players (code, player_id) VALUES (?, ?)').run(info.code, p.id);
  db.prepare('UPDATE duel_players SET score = ?, correct = ?, ms = ?, finished_at = ? WHERE code = ? AND player_id = ?').run(sc, c, t, now, info.code, p.id);
  return getDuel(db, info.code, token, now);
}

// ---------------- AI foydalanish limiti ----------------
/** Platform-wide daily ceiling for AI calls. FAIL-CLOSED: no configured limit (or 0) means no call is allowed. */
export function useGlobalAi(db: DatabaseSync, limit: number, now = Date.now()): number {
  if (!Number.isFinite(limit) || limit <= 0) throw new ApiError(503, 'AI ustoz hali sozlanmagan: umumiy kunlik chegara belgilanmagan.');
  const day = new Date(now).toISOString().slice(0, 10);
  const row = db.prepare('SELECT calls FROM ai_global_usage WHERE day = ?').get(day) as { calls: number } | undefined;
  if ((row?.calls ?? 0) >= limit) throw new ApiError(503, 'Bugungi umumiy AI chegarasi tugadi. Ertaga qayta urinib ko‘ring.');
  db.prepare('INSERT INTO ai_global_usage (day, calls) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET calls = calls + 1').run(day);
  return (row?.calls ?? 0) + 1;
}

export const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? 120);

/** Har bir AI so'rovdan oldin chaqiriladi: token tekshiriladi va kunlik limit hisoblanadi. */
export function useAi(db: DatabaseSync, token: string, now = Date.now(), limit = AI_DAILY_LIMIT, bucket = ''): number {
  const p = byToken(db, token);
  const day = (bucket ? `${bucket}:` : '') + new Date(now).toISOString().slice(0, 10);
  const row = db.prepare('SELECT calls FROM ai_usage WHERE player_id = ? AND day = ?').get(p.id, day) as { calls: number } | undefined;
  if ((row?.calls ?? 0) >= limit) throw new ApiError(429, 'Bugungi AI limiti tugadi. Ertaga qayta urinib ko‘ring.');
  db.prepare('INSERT INTO ai_usage (player_id, day, calls) VALUES (?, ?, 1) ON CONFLICT(player_id, day) DO UPDATE SET calls = calls + 1').run(p.id, day);
  return (row?.calls ?? 0) + 1;
}
