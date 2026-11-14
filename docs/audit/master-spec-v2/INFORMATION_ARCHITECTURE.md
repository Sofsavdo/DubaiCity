# Information Architecture

Proposed for owner review. Existing routes are preserved until a redirect map is approved (hash routes today; target routes decided with the SEO question in `MOCK_ARENA_SPEC.md` §6).

## 1. Primary navigation (owner text, §12)
1. **Home / Dashboard** 2. **General English** 3. **Exam Preparation** 4. **Mock Arena** 5. **AI Coach** 6. **Progress** (incl. Mistakes, Practice History) — plus **My Learning Plan** inside Home/Progress. Secondary (profile menu): Profile, Settings, Subscription, Help; Social (League, Duels, Games) sits under **Games** within General English and in a "Play" entry on mobile.

Mobile: bottom bar of 5 (Home, Learn, Exams, Mock Arena, Coach); Progress and Profile via header/profile menu. Desktop: top bar with the same items.

## 2. Mapping of existing routes
| Existing route | New home | Action |
|---|---|---|
| `#/` | Home/Dashboard | refactor to server data |
| `#/placement` | onboarding + Learn | keep, extend |
| `#/practice`, `#/grammar`, `#/games*`, `#/homework`, `#/shadow` | General English | move |
| `#/exam`, `#/exam/*` | Exam Preparation | keep |
| `#/mocks`, `#/mocks/full` | Mock Arena (free) | move |
| `#/results` | Progress | move |
| `#/league`, `#/duel` | Games/Social | keep |
| `#/tools` | NEEDS VERIFICATION → decide per tool | |
| `#/pricing`, `#/profile` | Subscription, Profile | refactor |

## 3. Site map (target)
```
Landing (public, per country/language)
Sign-in / onboarding (language settings → goal → placement)
Dashboard
General English: path → level → unit → lesson | vocabulary | grammar | reading | listening | writing | speaking | games
Exam Prep: IELTS Academic | IELTS General | CEFR | SAT → dashboard → tasks/mocks → plan → analytics
Mock Arena: catalogue → test → results → history
AI Coach: personality selection → session → feedback
Progress: skills, mastery, mistakes, history, plan
Account: profile, settings (4 language settings, privacy, data export/delete), subscription, credits
Social: leaderboard, duels, challenges
Creator (invited/approved) · Admin (role-gated, separate)
```

## 4. Rules
Each product has one landing screen stating its purpose; user can switch products in ≤2 taps; one account and one profile across products; the dashboard shows only real data (empty state → onboarding action).
