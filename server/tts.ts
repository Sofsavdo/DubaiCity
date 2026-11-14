import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// O'zbekcha neyron ovoz (Azure Speech). Kalit faqat serverda; TTS_KEY bo'lmasa xizmat o'chiq.
export interface TtsConfig { provider: 'azure' | 'none'; key: string; region: string; voice: string; cacheDir: string; fetchImpl?: typeof fetch }

export class TtsError extends Error { constructor(public status: number, message: string) { super(message); } }

export const MAX_TEXT = 280;
export const TTS_DAILY_LIMIT = Number(process.env.TTS_DAILY_LIMIT ?? 400);

export function ttsConfigFromEnv(cacheDir: string, env: NodeJS.ProcessEnv = process.env): TtsConfig {
  const key = env.TTS_KEY ?? '';
  const region = (env.TTS_REGION ?? '').trim();
  if (!key || !/^[a-z0-9-]{3,30}$/i.test(region)) return { provider: 'none', key: '', region: '', voice: '', cacheDir };
  const voice = env.TTS_VOICE && /^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(env.TTS_VOICE) ? env.TTS_VOICE : 'uz-UZ-MadinaNeural';
  return { provider: 'azure', key, region, voice, cacheDir };
}

const esc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c] as string);

export const ssml = (voice: string, text: string, rate = 1, pitch = 0): string =>
  `<speak version='1.0' xml:lang='uz-UZ' xmlns='http://www.w3.org/2001/10/synthesis'><voice name='${voice}'><prosody rate='${Math.round(rate * 100)}%' pitch='${pitch >= 0 ? '+' : ''}${pitch}%'>${esc(text)}</prosody></voice></speak>`;

export const cacheKey = (voice: string, text: string, rate: number, pitch: number): string =>
  createHash('sha256').update(`${voice}|${rate}|${pitch}|${text}`).digest('hex').slice(0, 32);

export function cleanText(raw: unknown): string {
  const t = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (!t) throw new TtsError(400, 'Matn bo‘sh');
  if (t.length > MAX_TEXT) throw new TtsError(400, 'Matn juda uzun');
  return t;
}

/** Matnni mp3 ga o'giradi. Bir xil matn diskdan beriladi (xarajat va kechikish yo'q). */
export async function synthesize(cfg: TtsConfig, text: string, opts: { rate?: number; pitch?: number } = {}): Promise<{ audio: Buffer; cached: boolean }> {
  if (cfg.provider === 'none') throw new TtsError(503, 'Ovoz xizmati yoqilmagan');
  const rate = Math.min(1.4, Math.max(0.7, opts.rate ?? 1));
  const pitch = Math.min(30, Math.max(-30, Math.round(opts.pitch ?? 0)));
  const file = join(cfg.cacheDir, `${cacheKey(cfg.voice, text, rate, pitch)}.mp3`);
  if (existsSync(file)) return { audio: readFileSync(file), cached: true };
  const f = cfg.fetchImpl ?? fetch;
  let r: Response;
  try {
    r = await f(`https://${cfg.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'ocp-apim-subscription-key': cfg.key, 'content-type': 'application/ssml+xml', 'x-microsoft-outputformat': 'audio-24khz-48kbitrate-mono-mp3', 'user-agent': 'bandly-tts' },
      body: ssml(cfg.voice, text, rate, pitch),
      signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new TtsError(502, 'Ovoz xizmatiga ulanib bo‘lmadi'); }
  if (!r.ok) throw new TtsError(502, `Ovoz xizmati xatosi (${r.status})`);
  const audio = Buffer.from(await r.arrayBuffer());
  if (audio.length < 200) throw new TtsError(502, 'Ovoz xizmati bo‘sh javob berdi');
  mkdirSync(cfg.cacheDir, { recursive: true });
  writeFileSync(file, audio);
  return { audio, cached: false };
}
