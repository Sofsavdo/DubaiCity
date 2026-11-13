import { DatabaseSync } from 'node:sqlite';
import { randomBytes } from 'node:crypto';

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

interface Player { id: number; nickname: string; xp: number; streak: number }

const byToken = (db: DatabaseSync, token: string): Player => {
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
