# UI/UX Specification

Spec level only; **no UI implementation** until the owner approves.

## 1. Starting point (verified in repo, `src/styles.css`, `src/brand.ts`)
Current identity: light theme + dark via `prefers-color-scheme`; coral-red brand `#ff4b3a`, blue `#1f5cff`, purple `#a855f7`, green `#12b76a`; radii 12/16/22/28 px; display font **Unbounded**, body **Inter Variable**; mascot component; content width 1120 px; header 68 px; mobile drawer menu. Texts are Uzbek-only and tagline says "IELTS ga o'zbek tilida tayyorlaning" (conflicts with the ecosystem vision — copy change after approval).
**Decision DR-14 (pending):** keep the coral/Unbounded identity and extend it, or move toward the navy+violet direction suggested in the owner's earlier spec. This spec proposes *keep and extend*, because it is coherent and already shipped; a brand review with the owner decides.

## 2. Token set to define [R]
Colors (surface/ink/line/brand/semantic + per-personality accents), typography scale, weights, spacing (4-px base), radius, shadow, borders, focus ring (≥3:1 contrast), component sizes (min 44 px touch target), breakpoints (360, 600, 980, 1280), motion (fast 120 ms / base 200 ms / slow 320 ms; reduced-motion honoured), z-index layers (header 40, drawer 60 as today).
**Fonts [U]:** verify Unbounded/Inter cover Cyrillic and Uzbek apostrophes (ʻ ʼ ’) and the kk/ky/tg special letters (e.g., Қ Ғ Ү Ө Ң, Ҳ Ӣ Ӯ); fallback stack required.

## 3. Principles
Calm, readable learning surfaces; exam mode = distraction-free layout (no nav, visible timer); few cards per screen; no fake stats; mobile-first; accessibility WCAG 2.1 AA target **[R]** (labels, focus, contrast, keyboard, screen-reader names, not colour-only).

## 4. Shared components (to document in COMPONENT_CATALOG during Phase 1)
Button, Tile/Card, TabBar/Nav, Progress ring/bar, Question renderer (MCQ, gap-fill, matching, T/F/NG, short answer, essay, audio), Timer, Audio player (limits), Recorder, **PersonalityBadge/Avatar** (states: idle, listening, thinking, speaking, interrupted, paused, error — icon + label + motion, never colour alone), LevelBadge, MasteryMeter, StreakChip, CreditMeter, Paywall/LockCard (server-driven), Toasts, EmptyState, ErrorState, LanguageSwitcher (4 settings).

## 5. Responsive rules
Single column ≤600; two columns 600–979; nav switches at 980 (as today); exam screens always single focus column with sticky timer/footer actions.

## 6. Acceptance criteria
Every screen passes: no horizontal scroll at 360 px; 44 px targets; keyboard reachable; contrast checks; ru strings (longest) don't clip; dark mode readable; screenshot tests at 360/1280.
