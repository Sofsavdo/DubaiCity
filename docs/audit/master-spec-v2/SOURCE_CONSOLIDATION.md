# SOURCE CONSOLIDATION — the three strategic conversations

Input: the owner pasted the text of the three ChatGPT conversations (links could not be opened from the sandbox). They are referred to here by content, not by link order, because the paste did not label them:
- **C1 "Strategy update"** — General English as the main product, Central Asia, GoPrep viral analysis, five personalities, Gemini Live voice cost, free Mock Arena, adaptive engine, USD pricing, competitor comparison.
- **C2 "Market, competition and investment analysis"** — Uzbekistan market, local competitors, AI unit costs in UZS, UZS pricing, break-even, growth plan, risks.
- **C3 "Early audit"** — design/product audit of five early screenshots, speaking critique, DB tables, admin panel, Claude-Code audit prompt.

`Loyiha tahlili.txt` was **not** included in the paste; if it is a separate file it is still unread. Legend: **[F]** verified by me · **[S]** stated in a source, **not verified by me** · **[H]** owner/source hypothesis · **[R]** my recommendation.

## 1. Precedence applied
1. The owner's later specifications (Master Spec v2, v3) → 2. C1 (it explicitly says "we change the strategy") → 3. C2 → 4. C3 (oldest, based on early screenshots; many items already outdated by later work, e.g. it criticises a text-box Speaking screen and a demo paywall, both known from Phase 0). Where C2/C3 contradict C1/v3, C1/v3 win and the contradiction is logged below.

## 2. What the sources agree on (consolidated, now treated as direction)
- Three products: **General English** (grammar inside), **Exam Preparation** (IELTS Academic/General, SAT, CEFR), **Mock Arena** (free objective tests), one **Adaptive Learning Intelligence** layer. (C1; matches v3.)
- General English level and exam readiness are **separate** measures (C1, C3, v3).
- Central Asia from the start, Uzbekistan first; English-first interface with a **separate explanation language** (C1). Languages en/uz/ru/kk/ky/tg.
- Five personalities; Savage is opt-in, no attacks on nationality/religion/gender/personal traits, no threats, never in official exam mode, soft mode default for minors (C1).
- Voice engine provider-agnostic; **English realtime first, Uzbek emotional voice = R&D, not a promised feature** (C1 §5, v3 §6).
- Mock Arena free for objectively graded tests (reading/listening auto-scored, no AI call); AI writing/speaking evaluation and plans are premium (C1 §6).
- Deterministic curriculum graph + error taxonomy + mastery score + plan-update rules; LLM only explains (C1 §7, C2 §3.2).
- AI credit system, no unlimited AI, fair-use (C1 §9, C2 §4.6).
- Creator program; reward tiers are a **test hypothesis**, payouts need verified views and admin approval (C1 §3.3).
- Server-side entitlements, webhook-verified payments, `xp_transactions` ledger, admin panel/CMS, content licence checks (C3 §9–10, v3).
- Original question banks, no copying of official papers; AI band scores are estimates (C2 §11).

## 3. New requirements not yet in the specs (now added)
| # | Item (source) | Handling |
|---|---|---|
| N1 | **Bandly for Schools / B2B**: teacher dashboard, group analytics, per-student tracking, bulk packages for learning centres (C2 §9, §12) | new `REQ-020`, new decision DR-25, roadmap slot after M3+M5 |
| N2 | **"AI Speaking Challenge" 7-day growth product** with shareable Speaking Report (C2 §3.3) | recorded as growth hypothesis DR-26; needs voice engine + ledger first |
| N3 | **Boss Exam, Vocabulary Arena, Grammar Battle, Listening Challenge, Weekly League, Personal Quest** (C3 §7) | added to gamification backlog (not yet inventoried) |
| N4 | **Speaking modes**: Practice, Real Exam, Strict Examiner, Savage, Pronunciation, Fluency (C3 §2) | mapped to `AI_PERSONALITY_ENGINE_SPEC` + `VOICE_ENGINE_SPEC` |
| N5 | **Per-skill Learn / Practice / Exam modes**; Reading tools: highlight, notes, flag-for-review, question navigator; Writing: autosave, revision history, compare drafts (C3 §4) | added as acceptance criteria to `EXAM_PREPARATION_SPEC` |
| N6 | **Mascot states** Happy/Thinking/Listening/Disappointed/Celebrating; mascot must not dominate adult-learner screens; XP toasts small, confetti only for big wins (C3 §1, §7) | added to `UI_UX_SPECIFICATION` |
| N7 | **Voice listening test method:** 5–10 real voice scenarios per language, judging naturalness, stress, emotion, code-switching, character consistency (C1 §5) | merged into voice evaluation plan |
| N8 | **Marketing success measured by CAC, LTV, payback**, not views/registrations (C2 §10.1) | added to `ANALYTICS_SPEC` |
| N9 | **Score-guarantee style offer** noted from GoPrep (C2 §2.1) | **not adopted**: legal/claims risk; logged as OD question |
| N10 | Creator tier entry rules: Starter 10 videos, Active 30 videos/month (C1) | stored as unapproved hypothesis in `CREATOR_PROGRAM_SPEC` |

## 4. Contradictions between sources and how they were resolved
| Topic | C1 / v3 (wins) | C2 / C3 (superseded) | Resolution |
|---|---|---|---|
| Grammar | inside General English | C2: Grammar Lab **39 000 UZS/mo as its own tier**; C3: separate Grammar subscription | Grammar never sold alone; any Grammar-only SKU is rejected |
| Pricing basis | USD plans $0 / 5.99 / 7.99 / 9.99, local prices per country | C2: UZS plans 0 / 39k / 49k / 89k / 149k; C3: five separate subscriptions | USD hypotheses stay the working set; UZS figures kept as a **market-price benchmark scenario** (below), unapproved |
| Free Mock Arena | many free objective mocks, SEO engine | C2: only 1 free full mock, monthly limited mock | many free (C1); abuse/cost limits per `MOCK_ARENA_SPEC`; owner confirms (OD-08) |
| First product | General English first in build order (C1 §10.1) | C2: IELTS AI first paid product; Grammar as retention product | **open**: owner chooses launch order (OD-15 extended; see §6) |
| Language emphasis | international, English interface, explanation language selectable | C2 "Uzbek-first AI" positioning | international framing; Uzbek explanation is a feature, not the brand |
| Market scope | Central Asia | C2 question: Uzbekistan only / UZ+CA / international | Central Asia, UZ first (owner v2/v3); launch per country after validation |
| Speaking free quota | v3: limited daily AI | C2: one-time 5-minute demo, no daily free minutes (arithmetic: 2 min/day ≈ 60 min/month = the paid allowance) | adopt C2's reasoning as a recommendation [R]; numbers are owner decisions |
| Product audit scores | — | C3: 5.2/10, Speaking 2/10, monetization 3/10 from 5 early screenshots | historical; superseded by `FEATURE_INVENTORY.md` (code-based). Not used as current evidence |

## 5. Facts in the sources — verification status
Everything below is **[S]**, not verified by me (sandbox has no access to these sites; no provider documentation was read):
- Competitor facts and prices (GoPrep, Trylab, MockCenter, IELTSUp, IELTSMock, Englev, MockSpace, Karvon, Praktika ≈ $8/mo, Ibrat Academy), GoPrep marketing figures (120 M views, $50 000 campaign, 728 000 visits, 11 700 conversions, "$2 M annualised revenue", 40 000+ users), GoPrep GoSpeak plans, Speak-or-Die thresholds.
- Market statistics (360 613 language-exam takers in 2025, +33 %, 62 179 certificate users, 94.2 % internet use), the SAM guess "180–250 thousand" (C2 itself calls it a planning scenario, not a statistic), and the central-bank rate **12 014.37 UZS/USD on 14.11.2026**.
- AI provider prices: "Gemini 3.8 Live" $0.005/min input, $0.018/min output; text-model token prices; OpenAI realtime/transcribe prices; and the claim that Gemini Live's voice-language list **excludes Uzbek**. Model names/versions especially need checking against current official pages. All provider numbers are `UNVERIFIED`.

**Arithmetic re-checked by hand (correct given the stated inputs) [F]:** 30+12 min = $0.366; 60+24 = $0.732; 10+4 = $0.122 ≈ 1 465 UZS at 12 014; plan mix 400/400/200 → $7 590/month; 89 000 − 16 225 = 72 775 contribution (81.8 %); break-even 18 M/72 775 ≈ 248 and 44 M/72 775 ≈ 605 paying users; 1 000 users → +54.78 M UZS; registration CAC 5 000, paid CAC 100 000 at 5 % and 33 333 at 15 %.
**Reasoning gaps to keep in mind [R]:** (a) the $5.99/7.99/9.99 and 89 000 UZS (≈ $7.4 at the cited rate) price sets are not the same offer; (b) 12 000 UZS "normal user AI budget" covers only ~60 min speaking + light text; heavy users 22 000; (c) variable cost omits storage/bandwidth for the free Mock Arena, support and taxes; (d) the 1 000-user table treats marketing as fixed and ignores churn, so retention is the missing variable; (e) the AI-budget range $630–1 050 for 1 000 payers rests on assumed usage, not logs.

## 6. Pricing scenarios kept in the register (all **[H]**, none approved)
| Scenario | Source | Plans |
|---|---|---|
| USD ecosystem | C1/v3 | Free $0 · General English $5.99 · Exam Prep $7.99 · All Access $9.99 (per month) |
| UZS market-benchmark | C2 | Free · 39k · 49k · 89k · 149k UZS/month (annual = 10 × monthly) — includes a Grammar-only tier, which conflicts with the architecture decision |
The owner must pick the working scenario (OD-09 extended); prices remain data, not constants.

## 7. Owner decisions the sources asked and that remain unanswered
C2 §14 asked four questions; the paste contains no answers:
1. First market — only Uzbekistan / Uzbekistan + Central Asia / international now. *(Later owner specs say Central Asia, Uzbekistan first, one country at a time — treat as answered in direction, confirmation pending.)*
2. First paid product — IELTS AI first / IELTS + Grammar + Mock together / Grammar-and-games first. **Open.**
3. First-stage budget — under 20 M / 20–50 M / 50–100 M / over 100 M UZS. **Open** (C2 recommends 34–50 M).
4. Monthly Speaking limit in the paid IELTS tier — 30 / 60 / 120 min / "unlimited with fair-use". **Open**; C2 recommends against unlimited.
Registered as OD-16 (launch order and first paid product), OD-17 (first-stage budget), OD-18 (speaking allowance per plan, part of OD-09).

## 8. Final consolidated conclusion
1. **Strategy is stable:** three products + one intelligence layer, Central Asia, personality-driven AI, free objective Mock Arena, creator-led growth, credit-metered AI. No source contradicts this after precedence is applied.
2. **The main differentiator is the learning system, not AI chat or roasting** (C1, C2): per-user error memory, mastery-driven plans, explanations in the learner's chosen language. Local competitors already offer AI speaking/writing, free mocks and Uzbek feedback **[S]**, so "AI + IELTS + games" alone is not an advantage.
3. **Unit economics look viable only with strict AI limits and measured retention** [S + F arithmetic]; real numbers need real usage logs and verified provider prices.
4. **New scope to plan:** B2B "Bandly for Schools", the 7-day Speaking Challenge growth product, richer gamification, per-skill modes. None changes the foundation order (M1 → M2 → M3 …).
5. **Still blocked:** residency/legal (OD-01), age/Savage standard (OD-06/06b), provider verification (voice, pricing), content licensing and specialist review, owner choices OD-16…OD-18.
6. **Not carried over:** Grammar-only product, five separate subscriptions, score guarantee, UZS prices as final.
