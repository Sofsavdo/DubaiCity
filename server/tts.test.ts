import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TtsError, cacheKey, cleanText, ssml, synthesize, ttsConfigFromEnv } from './tts';

const dir = mkdtempSync(join(tmpdir(), 'tts-'));
// Sozlama
assert.equal(ttsConfigFromEnv(dir, {}).provider, 'none');
assert.equal(ttsConfigFromEnv(dir, { TTS_KEY: 'k', TTS_REGION: 'bad region!' }).provider, 'none');
const cfg0 = ttsConfigFromEnv(dir, { TTS_KEY: 'k', TTS_REGION: 'westeurope' });
assert.equal(cfg0.provider, 'azure'); assert.equal(cfg0.voice, 'uz-UZ-MadinaNeural');
assert.equal(ttsConfigFromEnv(dir, { TTS_KEY: 'k', TTS_REGION: 'westeurope', TTS_VOICE: 'uz-UZ-SardorNeural' }).voice, 'uz-UZ-SardorNeural');
assert.equal(ttsConfigFromEnv(dir, { TTS_KEY: 'k', TTS_REGION: 'westeurope', TTS_VOICE: '"><evil' }).voice, 'uz-UZ-MadinaNeural', 'noto‘g‘ri ovoz nomi rad etiladi');

// Matn
assert.throws(() => cleanText('  '), TtsError);
assert.throws(() => cleanText('a'.repeat(281)), TtsError);
assert.equal(cleanText(' Salom   dunyo '), 'Salom dunyo');
assert.ok(ssml('uz-UZ-MadinaNeural', 'a <b> & "c"').includes('a &lt;b&gt; &amp; &quot;c&quot;'), 'SSML belgilari qochiriladi');
assert.notEqual(cacheKey('v', 'a', 1, 0), cacheKey('v', 'b', 1, 0));

// Sintez + kesh (soxta server)
let calls = 0; let seen: { url: string; headers: Record<string, string>; body: string } | null = null;
const fake = (async (url: string, init: { headers: Record<string, string>; body: string }) => { calls++; seen = { url, headers: init.headers, body: init.body }; return new Response(new Uint8Array(600).fill(7), { status: 200 }); }) as unknown as typeof fetch;
const cfg = { ...cfg0, fetchImpl: fake };
const a = await synthesize(cfg, 'Qoyil!');
assert.equal(a.cached, false); assert.equal(a.audio.length, 600); assert.equal(calls, 1);
assert.equal(seen!.url, 'https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1');
assert.equal(seen!.headers['ocp-apim-subscription-key'], 'k');
assert.ok(seen!.body.includes('Qoyil!') && seen!.body.includes('uz-UZ-MadinaNeural'));
const b = await synthesize(cfg, 'Qoyil!');
assert.equal(b.cached, true); assert.equal(calls, 1, 'bir xil matn qayta so‘ralmaydi');
await synthesize(cfg, 'Qoyil!', { rate: 1.2 });
assert.equal(calls, 2, 'boshqa tezlik — boshqa kesh');
assert.equal(readdirSync(dir).length, 2);

// Xatolar
await assert.rejects(synthesize({ ...cfg, provider: 'none' }, 'x'), (e: TtsError) => e.status === 503);
await assert.rejects(synthesize({ ...cfg, fetchImpl: (async () => new Response('no', { status: 401 })) as unknown as typeof fetch }, 'Boshqa matn'), (e: TtsError) => e.status === 502);
await assert.rejects(synthesize({ ...cfg, fetchImpl: (async () => new Response(new Uint8Array(5), { status: 200 })) as unknown as typeof fetch }, 'Yana matn'), (e: TtsError) => e.status === 502);
await assert.rejects(synthesize({ ...cfg, fetchImpl: (async () => { throw new Error('net'); }) as unknown as typeof fetch }, 'Tarmoq'), (e: TtsError) => e.status === 502);

rmSync(dir, { recursive: true, force: true });
console.log('tts.test: OK');
