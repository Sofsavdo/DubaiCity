#!/usr/bin/env python3
"""Neyron ovoz (Kokoro, Apache-2.0) bilan mp3 yaratadi. Ishlatish:
   python3 -m venv venv && venv/bin/pip install kokoro-onnx soundfile
   (model fayllarini https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0 dan yuklang)
   npx tsx tools/audio-tasks.ts > tasks.json
   venv/bin/python tools/gen-audio.py tasks.json MODELS_DIR public/audio
Mavjud fayllar qayta yaratilmaydi."""
import faulthandler, json, os, subprocess, sys, tempfile, time
faulthandler.dump_traceback_later(90, repeat=True)
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

tasks_path, models, out = sys.argv[1:4]
tasks = json.load(open(tasks_path))
k = Kokoro(os.path.join(models, "kokoro-v1.0.int8.onnx"), os.path.join(models, "voices-v1.0.bin"))
os.makedirs(f"{out}/clips", exist_ok=True); os.makedirs(f"{out}/listening", exist_ok=True)
SR = 24000

def lang(voice): return "en-gb" if voice.startswith("b") else "en-us"

def tidy(x, target_rms=0.125):
    """Boshi/oxiridagi jimlikni kesadi va balandlikni tenglashtiradi (ffmpeg filtrlarisiz: ular ba'zan qotib qoladi)."""
    x = x.astype(np.float32)
    idx = np.where(np.abs(x) > 0.012)[0]
    if len(idx):
        pad = int(SR * 0.06)
        x = x[max(0, idx[0] - pad): idx[-1] + pad * 2]
    rms = float(np.sqrt(np.mean(x ** 2))) or 1e-6
    x = x * min(target_rms / rms, 0.95 / (float(np.max(np.abs(x))) or 1.0))
    return x

def to_mp3(samples, dest, norm=True):
    if norm: samples = tidy(samples)
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, "a.wav"); sf.write(w, samples, SR)
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", w, "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", "40k", dest], check=True, timeout=60)

t0 = time.time(); done = 0; skipped = 0
for c in tasks["clips"]:
    dest = f"{out}/clips/{c['key']}.mp3"
    if os.path.exists(dest): skipped += 1; continue
    text = c["text"].replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    samples, _ = k.create(text, voice=c["voice"], speed=c["speed"], lang=lang(c["voice"]))
    to_mp3(samples, dest); done += 1; faulthandler.cancel_dump_traceback_later(); faulthandler.dump_traceback_later(90, repeat=True)
    if done % 20 == 0: print(f"clips {done} (+{skipped} bor), {time.time()-t0:.0f}s", flush=True)

listening = {}
for t in tasks["listens"]:
    dest = f"{out}/listening/{t['id']}.mp3"
    if not os.path.exists(dest):
        parts = []
        for line in t["lines"]:
            s, _ = k.create(line["text"], voice=line["voice"], speed=0.95, lang=lang(line["voice"]))
            parts += [s.astype(np.float32), np.zeros(int(SR * t["pauseMs"] / 1000), dtype=np.float32)]
        to_mp3(np.concatenate(parts), dest)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest]).strip())
    listening[t["id"]] = {"file": f"/audio/listening/{t['id']}.mp3", "seconds": round(dur, 1)}
    print("listening", t["id"], round(dur, 1), "s", flush=True)

keys = sorted(os.path.basename(f)[:-4] for f in os.listdir(f"{out}/clips") if f.endswith(".mp3"))
json.dump({"clips": keys, "listening": listening}, open(f"{out}/manifest.json", "w"))
print("tayyor:", len(keys), "clip,", len(listening), "listening,", f"{time.time()-t0:.0f}s")
