# Multilingual Architecture

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

**Locales:** `en`, `uz`, `ru`, `kk`, `ky`, `tg` (later `tk`). Verified in Node 22/ICU 78.3 for en/uz/ru only (`FINAL_ARCHITECTURE_SPEC` §5). **[U]** kk/ky/tg plural rules, number/date formats and font coverage must be checked with the same script before commitment.

**Four settings** per user (stored server-side after M3, localStorage before):

```
interface_lang   ∈ locales            default: browser → country default → en
explanation_lang ∈ locales            default: interface_lang
learning_lang    = 'en' (extensible)  default: en
voice_lang       ∈ {en} initially     extended only after provider tests (§3)
```

Rules: settings are independent; AI explanations are generated in `explanation_lang` while examples stay English; English exam text is never translated; missing key falls back to English and logs; translation content has states `draft → reviewed (native speaker) → published`; machine drafts stay `draft` and are not shown unless the owner opts in. Catalogue is the ICU-message-format-style key store with placeholder-parity and plural-category checks (build fails on mismatch). Cyrillic and Uzbek Latin apostrophes (ʻ ʼ ’) require the chosen font to be tested (**[U]**).

**Speech support matrix** (starts empty; a cell turns "supported" only after the §3 test passes):

| Language | STT | TTS | Realtime |
|---|---|---|---|
| en | browser only (unverified on devices) | optional vendor, untested | none |
| uz, ru, kk, ky, tg | not verified | not verified | not verified |

## Update from Master Spec v3 (owner text)
- Additional required items: translation dictionaries, locale-aware date/number/currency formatting, language fallback, missing-translation handling, **right-to-left readiness** (CSS logical properties and `dir` support so a future RTL locale does not need a rewrite; none of the six planned locales is RTL **[F]** — en, uz, ru, kk, ky, tg are left-to-right; Tajik may also appear in Arabic script historically but Cyrillic is the standard script here **[U]** confirm with a native reviewer).
- Example setting sets from the owner: (Interface uz, Explanation uz, Learning en, Voice en) and (Interface ru, Explanation kk, Learning en, Voice en) — both must be valid combinations; test matrix covers them.
- Voice language is validated against the verified speech matrix; selecting an unsupported voice language falls back to English voice with an on-screen notice.
