# Voice Engine Spec

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

**Candidates to evaluate [U — listed only as candidates, no capability or price asserted]:** browser Web Speech (baseline), major cloud speech vendors (e.g., Microsoft Azure Speech, Google Cloud Speech/TTS), real-time voice APIs of LLM vendors, ElevenLabs, Deepgram, and any Uzbek-focused local vendors the owner knows of.

**Method:**
1. For each candidate, read **current official documentation** (supported languages/locales, streaming, barge-in/interruption, SSML/prosody, data retention, regional endpoints, commercial licence, rate limits, published price). Record URL + retrieval date. *Sandbox note:* outbound access to vendor sites may be blocked here; if so, the owner must supply exports or allow the hosts.
2. Build a **test corpus**: 30 short utterances per language (en with Uzbek/Russian/Kazakh/Kyrgyz/Tajik accents, plus native languages), recorded by volunteers with consent; 10 noisy-phone samples. Corpus is original, stored only in the owner's controlled location.
3. Metrics: word error rate (STT), intelligibility rating by native reviewers (TTS, 1–5, ≥3 reviewers), first-audio latency, barge-in success rate, failure/timeouts, cost per minute **from the vendor's current price sheet**.
4. Decision rule: a language/feature is listed as supported only if WER and reviewer scores meet thresholds the owner sets (OD-09/OD-10); otherwise the UI states "not available".
5. Output: `VOICE_PROVIDER_EVALUATION.md` (to be created in Phase 5 planning) with sources, dates, raw results. No key is requested until the owner approves the test (keys go in Railway variables, never chat).

Architecture seam: `SttProvider`, `TtsProvider`, `RealtimeProvider` interfaces with `capabilities` flags (`languages`, `streaming`, `bargeIn`, `usageReporting`, `retrySafety`) consumed by the credit engine (`FINAL_AI_CREDIT_SPEC` §6).

## Update from Master Spec v3 (owner text)
- **Interfaces (all provider-agnostic):** STT, TTS, LLM, Realtime Voice, **Pronunciation Assessment**, Writing Evaluation.
- **Required capabilities:** streaming, latency monitoring, **provider fallback policy**, timeouts, audio session management, voice configuration, transcript storage policy, cost tracking, usage limits.
- **Fallback policy [R]:** fallback only between providers marked equivalent for that language; never to a provider outside the approved data-residency set (OD-01); a fallback after bytes were sent follows `retrySafety` in `FINAL_AI_CREDIT_SPEC.md` §6 (no silent double calls); the UI shows which mode is active ("voice unavailable, text mode").
- **Order of work (owner):** (1) test English real-time speaking quality first; (2) only then Uzbek, Russian and other local voices. Uzbek emotional voice is **R&D, not a promised feature**; fallback is English voice + on-screen explanation in the chosen language.
- **Character in voice** (friendly / angry / funny / serious / sarcastic) is "as far as possible"; each voice style needs its own listening test; unsupported styles are not advertised.
- **Transcript/audio retention:** default **no raw audio stored**; transcripts stored only per OD-07 retention; user can delete. Every provider field is `UNVERIFIED` until a dated source is recorded.
