import { BRAND } from '../brand';

/** Matnni berilgan kenglikka (belgilar soni) qatorlarga bo'ladi. */
export function wrapLines(text: string, maxChars: number): string[] {
  const out: string[] = []; let line = '';
  for (const w of text.split(/\s+/).filter(Boolean)) {
    if ((line + ' ' + w).trim().length > maxChars && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

/** Ulashish uchun kvadrat rasm (PNG): maslahat yoki so'z. Faqat brauzerda. */
export async function renderCard(opts: { title: string; body: string; foot: string; sub?: string }): Promise<Blob | null> {
  const S = 1080;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const g = c.getContext('2d'); if (!g) return null;
  const bg = g.createLinearGradient(0, 0, S, S); bg.addColorStop(0, '#12162b'); bg.addColorStop(1, '#2a1230');
  g.fillStyle = bg; g.fillRect(0, 0, S, S);
  const glow = g.createRadialGradient(S * 0.85, S * 0.1, 10, S * 0.85, S * 0.1, S * 0.7); glow.addColorStop(0, 'rgba(255,75,58,.55)'); glow.addColorStop(1, 'rgba(255,75,58,0)');
  g.fillStyle = glow; g.fillRect(0, 0, S, S);
  g.fillStyle = '#ffb02e'; g.font = '800 120px Georgia, serif'; g.fillText('“', 80, 190);
  g.fillStyle = '#ff7a6b'; g.font = '700 34px system-ui, sans-serif'; g.fillText(opts.title.toUpperCase(), 80, 290);
  g.fillStyle = '#ffffff'; g.font = '700 66px system-ui, sans-serif';
  const lines = wrapLines(opts.body, 24); lines.slice(0, 7).forEach((l, i) => g.fillText(l, 80, 390 + i * 84));
  if (opts.sub) { g.fillStyle = '#c9cde6'; g.font = '500 38px system-ui, sans-serif'; wrapLines(opts.sub, 44).slice(0, 3).forEach((l, i) => g.fillText(l, 80, 390 + Math.min(lines.length, 7) * 84 + 30 + i * 52)); }
  g.fillStyle = '#ffb02e'; g.fillRect(80, 930, 110, 6);
  g.fillStyle = '#fff'; g.font = 'italic 600 38px system-ui, sans-serif'; g.fillText(opts.foot, 80, 990);
  g.textAlign = 'right'; g.fillStyle = '#ff4b3a'; g.font = '800 44px system-ui, sans-serif'; g.fillText(BRAND.name, S - 80, 990);
  return new Promise((r) => c.toBlob((b) => r(b), 'image/png'));
}

/** Ulashish (mobil) yoki yuklab olish. */
export async function shareCard(blob: Blob, name: string, text: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], `${name}.png`, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) { try { await nav.share({ files: [file], text }); return 'shared'; } catch { /* bekor qilindi */ } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${name}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
