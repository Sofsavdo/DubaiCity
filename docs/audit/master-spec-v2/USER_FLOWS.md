# User Flows (step lists; diagrams to follow in Phase 1 review)

Each flow lists the happy path, key failure states and the server data touched. "Honest unavailable" = clear message, no fake output.

1. **First visit → signup.** Landing (country/language from browser, user can change) → Mock Arena demo test (no signup) or Sign up (email code / Google / Telegram, OD-05) → language settings (4) → age band (OD-06) → goal + exam date + weekly time → placement. Failure: email not delivered → resend/other method.
2. **Placement → plan.** Skill-by-skill diagnostic → profile written (GE level and exam readiness stored separately) → first plan shown with reasons → "Start today's task".
3. **Daily learning.** Dashboard "Continue" → lesson (objective → explain → practice → mastery check) → result → mastery update → revision queue → next recommended action with reason.
4. **Mock Arena test.** Catalogue → choose exam/test → instructions & duration → start (server timer) → answer (autosave) → submit (idempotent) → results & explanations → weakness summary → optional AI feedback (credits) → plan updated. Failure: connection lost → resume; time expired → auto-submit.
5. **AI speaking session.** Choose personality (age/mode rules) → mic permission → session (listening/thinking/speaking states, interrupt, end) → transcript & feedback tied to taxonomy → credits settled. Failure: provider down → text mode or "unavailable"; permission denied → instructions.
6. **IELTS Writing evaluation.** Task → write → submit → rubric estimate (labelled estimate) → errors classified → remedial GE lessons recommended → re-attempt check.
7. **Subscribe.** Pricing (country price) → choose plan → provider checkout → webhook confirms → entitlement active (never from the browser) → receipt. Failure: pending/failed → status page, retry; cancel/expire flows.
8. **Language settings change.** Settings → interface/explanation/learning/voice independently → unsupported voice language disabled with reason.
9. **Duels / games.** Invite or match → timed play → server scoring → result/history. Anti-cheat checks.
10. **Creator.** Apply → approval → get link → submit video claim → verification → reward state (payout only after owner-approved rules).
11. **Account deletion / export.** Request → confirm → 14-day recovery (OD-07) → deletion; export file delivered.
12. **Admin content publish.** Draft → review (different person) → approve → publish → version recorded.
