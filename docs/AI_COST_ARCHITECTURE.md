# BANDLY — AI and Cost Architecture

## 1. Where things stand

| Capability | Today | Evidence |
|---|---|---|
| Text model | One function `complete()` that switches between Anthropic, OpenAI-compatible and Gemini HTTP calls | `server/ai.ts` |
| Features using it | Speaking follow-up question, Speaking evaluation, Writing evaluation, persona reply | `/api/ai/*` |
| Speech-to-text | Browser Web Speech API; no server component | `src/lib/speech.ts` |
| Text-to-speech | Pre-generated English clips (no runtime cost); optional Azure adapter for Uzbek with disk cache | `public/audio`, `server/tts.ts` |
| Realtime voice | None | — |
| Pronunciation assessment | None | — |
| Metering | Requests per user per day (`ai_usage`), default limit 120 | `server/db.ts` |
| Cost tracking | None | — |
| Live status | **No key is configured.** Production log: `AI: none, TTS: none`. Nothing has ever been called against a real provider. | Railway deploy log |

No AI result is faked: when no key is present the AI buttons are hidden and the rule-based feedback is labelled as non-AI. That behaviour must be preserved.

## 2. Provider interfaces

All vendor code lives in `server/ai-gateway/`. Feature code imports only these interfaces.

```ts
interface ProviderHealth { ok: boolean; latencyMs?: number; detail?: string }
interface Usage { inputTokens?: number; outputTokens?: number; audioInMs?: number; audioOutMs?: number; requests: number }

interface LLMProvider {
  id: string;                                    // e.g. "gemini", "openai"
  complete(req: { system: string; messages: Msg[]; json?: JsonSchema; maxOutputTokens: number; timeoutMs: number }): Promise<{ text: string; usage: Usage; model: string }>;
  health(): Promise<ProviderHealth>;
}
interface SpeechToTextProvider {
  id: string; supportedLocales(): string[];
  transcribe(req: { audio: Uint8Array; mime: string; locale: string; wordTimestamps?: boolean }): Promise<{ text: string; words?: Word[]; usage: Usage }>;
  health(): Promise<ProviderHealth>;
}
interface TextToSpeechProvider {
  id: string; voices(locale: string): Promise<Voice[]>;
  synthesize(req: { text: string; locale: string; voice: string; style?: VoiceStyle }): Promise<{ audio: Uint8Array; mime: string; usage: Usage }>;
  health(): Promise<ProviderHealth>;
}
interface RealtimeVoiceProvider {
  id: string; supportedLocales(): string[];
  openSession(cfg: { personality: PersonalityConfig; locale: string; maxSeconds: number }): Promise<RealtimeSession>;  // server-brokered, short-lived client token
  health(): Promise<ProviderHealth>;
}
interface WritingEvaluationProvider {
  id: string;
  evaluate(req: { rubric: Rubric; prompt: string; text: string; explanationLocale: string }): Promise<{ scores: Record<string, number>; feedback: Feedback; usage: Usage }>;
}
```

Rules for the gateway:

- **Configuration by environment**, validated at startup: `LLM_PROVIDER`, `STT_PROVIDER`, `TTS_PROVIDER`, `REALTIME_PROVIDER` and their keys. A missing or invalid value disables that capability; it never crashes the service and never falls back to invented output.
- **Timeouts and retries**: one retry on network error or 5xx with jitter; no retry on 4xx; hard timeout per call type.
- **Health checks** exposed at `/api/ai/health` (admin only) and cached for 60 s.
- **Structured output** is validated against a schema; an unparseable answer is an error shown to the user as "evaluation unavailable", not a guessed score.
- **Prompt-injection hygiene**: learner text is always passed as delimited data (already done in `server/ai.ts`).
- **Language support is data, not assumption**: `languages.is_voice_enabled` is switched on per locale only after a recorded test of STT and TTS for that locale with the chosen provider.

### Language support that must be tested, not assumed

| Locale | Text explanations | Speech recognition | Speech synthesis |
|---|---|---|---|
| English | Expected to work with any major model | Must be measured on learner accents | Current pre-generated voices are good; live TTS untested |
| Russian | Expected to work | To test | To test |
| Uzbek, Kazakh | Quality must be reviewed by native speakers | To test — support varies by vendor | To test — the Azure Uzbek voice names in `.env.example` are unverified |
| Kyrgyz, Tajik | Quality must be reviewed by native speakers | To test — may be unavailable | To test — may be unavailable |

If a locale has no acceptable voice, the product falls back to English voice with on-screen text in the learner's language (the pattern already used for A1–A2 Speaking hints).

## 3. Personality engine

Personalities are configuration records, not separate code paths:

```ts
interface PersonalityConfig {
  id: 'friendly_coach' | 'strict_examiner' | 'savage_coach' | 'comedy_friend' | 'debate_opponent';
  tone: string; speakingRate: number; responseStyle: 'brief' | 'detailed';
  humor: 0 | 1 | 2 | 3; emotionalIntensity: 0 | 1 | 2 | 3;
  correction: 'inline' | 'end_of_turn' | 'end_of_session';
  vocabularyCeiling: Cefr; difficulty: 'adaptive' | Cefr;
  adultOnly: boolean; allowMildProfanity: boolean;
}
```

- `savage_coach` requires a verified adult account and an explicit opt-in; minors are always served the age-appropriate set regardless of client input.
- A server-side output filter (extending today's `FORBIDDEN` list to every supported language) blocks discriminatory content, threats and personal harassment for all personalities.
- `strict_examiner` uses the public IELTS band descriptors as its rubric and always labels the result as an estimate, never an official score.
- Today's four "roast levels" map onto `friendly_coach`, `strict_examiner` and `savage_coach`; `comedy_friend` and `debate_opponent` are new.

## 4. Deterministic-first policy

| Task | Method | AI cost |
|---|---|---|
| Reading, Listening, grammar, vocabulary, SAT maths/verbal multiple choice | Answer keys | None |
| Placement and mock scoring | Rules and conversion tables | None |
| Study-plan generation, difficulty adjustment, spaced repetition | Rules over the learner profile | None |
| Known error patterns in learner text | Rule checker (exists) runs first; only unresolved text goes to a model | Reduced |
| Listening audio, fixed examiner lines, vocabulary audio | Pre-generated and cached | None at runtime |
| Writing evaluation, Speaking evaluation, free conversation, pronunciation feedback | Model, metered | Yes |
| Explanations in the learner's language for authored content | Authored once, stored as translations | None at runtime |

Identical requests are cached by content hash (the TTS adapter already does this).

## 5. Metering

Every provider call writes one `usage_records` row (see `DATABASE_DESIGN.md`): user, product, session, provider, model, kind, input and output tokens, audio in and out, request count, latency, status and `estimated_cost_micro_usd`.

`estimated_cost = Σ(units × provider_prices.price)` using the `provider_prices` table, which is filled in by hand from each vendor's published price list on the day a provider is enabled and whenever prices change. **This document deliberately contains no vendor prices**: none has been verified, and they change.

Reports (admin): cost by user, by product, by plan, by day; cost per active subscriber; top 1 % of users by cost; error and timeout rate by provider.

## 6. Credits and limits

- Each plan grants a number of **AI credits** per period through `plan_entitlements`. One credit is a fixed cost unit; each feature has a credit price configured in data (for example: a Writing evaluation, one minute of realtime speaking, one Speaking evaluation).
- The balance is an append-only ledger on the server. The client never submits a balance or a plan.
- A request is admitted only if (a) the plan includes the feature, (b) credits are available, (c) per-minute and per-day rate limits are respected, (d) the provider is healthy.
- Hard caps per session (maximum seconds of realtime voice, maximum tokens per evaluation) bound the worst case of a single request.
- A global daily spend ceiling switches AI features to "temporarily unavailable" rather than overspending.
- "Unlimited" is never offered.

## 7. Cost model

Costs cannot be stated in dollars until providers are chosen. The model below gives the quantities to measure; the assumptions are estimates to be replaced by measurements in Phase 3.

| Feature | Unit of use | Assumed quantity per use (to be measured) |
|---|---|---|
| Writing Task 2 evaluation | 1 request | ~600 input tokens of essay and rubric + ~500 output tokens |
| Speaking evaluation (text of a full test) | 1 request | ~1 500 input + ~500 output tokens |
| Follow-up question in Speaking | per turn | ~300 input + ~60 output tokens |
| Realtime voice conversation | per minute | 1 minute audio in + ~0.5 minute audio out, or the vendor's per-minute rate |
| Server speech-to-text for shadowing | per attempt | ~5–10 s audio |
| Live text-to-speech | per sentence | ~100 characters, cached after first use |

**Unit economics check, per plan:**

```
gross margin per subscriber = price × (1 − payment fee %) − AI cost per subscriber − infrastructure share
AI cost per subscriber     = Σ over features (uses per month × units per use × unit price)
```

The plan's credit allowance is set so that a subscriber who uses the **whole** allowance still leaves the target margin. With prices of $5.99–$9.99 the realtime-voice minutes are the dominant term and must be capped first. The free tier's daily allowance is sized from the same formula against the acceptable acquisition cost per free user.

## 8. Operating-cost implications by phase

| Phase | New AI cost |
|---|---|
| 1 Foundation | None (interfaces and metering only) |
| 2 General English | None at runtime if explanations are authored; one-off cost if translations are machine-drafted and then human-reviewed |
| 3 AI voice | The main variable cost; gated by credits from the first day |
| 4 Exam preparation | Writing and Speaking evaluations, metered |
| 5 Mock Arena | None for objective tests |
| 6–8 | None directly |
