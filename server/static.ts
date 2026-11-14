import { createReadStream, existsSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
};

/** dist/ ichidagi faylni beradi; papkadan tashqariga chiqishga yo'l qo'ymaydi. Topilmasa index.html (SPA). */
export function resolveStatic(root: string, urlPath: string): { file: string; fallback: boolean } | null {
  let p: string;
  try { p = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  if (p.includes('\0')) return null;
  const base = resolve(root);
  const target = resolve(join(base, normalize(p)));
  if (target !== base && !target.startsWith(base + sep)) return null; // path traversal
  if (existsSync(target) && statSync(target).isFile()) return { file: target, fallback: false };
  if (extname(target)) return null; // mavjud bo'lmagan .js/.css/.png fayllar uchun HTML emas, 404
  const index = join(base, 'index.html');
  return existsSync(index) ? { file: index, fallback: true } : null;
}

/** "bytes=START-END" sarlavhasini tahlil qiladi (Safari audio uchun majburiy). Yaroqsiz bo'lsa null. */
export function parseRange(header: string | undefined, size: number): { start: number; end: number } | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header ?? '');
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start: number, end: number;
  if (m[1] === '') { const n = Number(m[2]); start = Math.max(0, size - n); end = size - 1; } // oxirgi n bayt
  else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1); }
  return start <= end && start < size ? { start, end } : null;
}

export function serveStatic(req: IncomingMessage, res: ServerResponse, root: string): boolean {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const hit = resolveStatic(root, new URL(req.url ?? '/', 'http://x').pathname);
  if (!hit) return false;
  const hashed = /\/assets\/.+-[\w-]{8,}\.\w+$/.test(hit.file) && !hit.fallback;
  const isAudio = extname(hit.file) === '.mp3';
  const size = statSync(hit.file).size;
  const headers: Record<string, string | number> = {
    'content-type': MIME[extname(hit.file)] ?? 'application/octet-stream',
    'cache-control': hashed ? 'public, max-age=31536000, immutable' : isAudio ? 'public, max-age=86400' : 'no-cache',
    'accept-ranges': 'bytes',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'microphone=(self)',
  };
  const rangeHeader = req.headers.range;
  if (rangeHeader && isAudio) {
    const r = parseRange(rangeHeader, size);
    if (!r) { res.writeHead(416, { 'content-range': `bytes */${size}` }); res.end(); return true; }
    res.writeHead(206, { ...headers, 'content-range': `bytes ${r.start}-${r.end}/${size}`, 'content-length': r.end - r.start + 1 });
    if (req.method === 'HEAD') { res.end(); return true; }
    createReadStream(hit.file, { start: r.start, end: r.end }).pipe(res);
    return true;
  }
  res.writeHead(200, { ...headers, 'content-length': size });
  if (req.method === 'HEAD') { res.end(); return true; }
  createReadStream(hit.file).pipe(res);
  return true;
}
