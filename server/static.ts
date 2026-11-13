import { createReadStream, existsSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
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

export function serveStatic(req: IncomingMessage, res: ServerResponse, root: string): boolean {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const hit = resolveStatic(root, new URL(req.url ?? '/', 'http://x').pathname);
  if (!hit) return false;
  const hashed = /\/assets\/.+-[\w-]{8,}\.\w+$/.test(hit.file) && !hit.fallback;
  res.writeHead(200, {
    'content-type': MIME[extname(hit.file)] ?? 'application/octet-stream',
    'cache-control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'microphone=(self)',
  });
  if (req.method === 'HEAD') { res.end(); return true; }
  createReadStream(hit.file).pipe(res);
  return true;
}
