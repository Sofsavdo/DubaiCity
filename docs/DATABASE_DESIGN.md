# BANDLY — Database Design

## 1. Current schema (SQLite, `server/db.ts`)

| Table | Columns | Purpose |
|---|---|---|
| `players` | `id`, `token` (unique), `nickname` (unique, case-insensitive), `xp`, `streak`, `created_at`, `updated_at` | Identity and league totals |
| `xp_log` | `player_id`, `ts`, `delta` | Weekly league, hourly anti-cheat cap |
| `ai_usage` | `player_id`, `day`, `calls` | Daily request counter (also reused for TTS with a `tts:` prefix) |
| `payments` | `id`, `player_id`, `track`, `days`, `amount`, `hamyon_payment_id`, `hamyon_amount`, `card`, `status`, `expire_at`, `error`, `note`, `created_at`, `paid_at`, `checked_at` | Hamyon payments |
| `subscriptions` | `player_id`, `track`, `until` | Access by track (`exam`, `grammar`, `mocks`) |
| `duels`, `duel_players` | code, words, scores | Word duels |

There is no ORM, no migration history and no schema version. Foreign keys are declared; enforcement relies on the Node driver's default setting and is not asserted by any test. Everything else a learner produces is in the browser (see audit finding C1).

**Production data today:** nicknames, league XP and duels. No payments have been taken (payments are not configured). The data set is small, which makes this the cheapest moment to change the storage engine.

## 2. Target schema (PostgreSQL)

Conventions: `id` is `uuid` unless noted; every table has `created_at`; mutable tables have `updated_at`; money is stored in minor units with a currency code; enumerations are lookup tables or checked text, not magic numbers; all foreign keys are indexed.

### Identity

| Table | Key fields | Notes |
|---|---|---|
| `users` | `id`, `display_name`, `birth_year`, `is_minor` (derived), `ui_locale`, `explanation_locale`, `country`, `timezone`, `legacy_player_id` | `legacy_player_id` links to today's `players.id` |
| `user_identities` | `user_id`, `provider` (`email`, `google`, `telegram`, `legacy_token`), `subject`, `verified_at` | Unique on (`provider`, `subject`) |
| `sessions` | `id`, `user_id`, `expires_at`, `revoked_at`, `user_agent` | Server-side sessions |
| `languages` | `code`, `name`, `is_ui_enabled`, `is_voice_enabled` | `en, uz, ru, kk, ky, tg` to start |

### Commerce

| Table | Key fields | Notes |
|---|---|---|
| `products` | `code` (`general_english`, `exam_prep`, `mock_arena`), `name` | Three products |
| `plans` | `code` (`free`, `general`, `exam`, `all_access`), `is_active` | Pricing tiers |
| `plan_entitlements` | `plan_id`, `feature_code`, `limit_value`, `limit_period` | Entitlements independent of price |
| `prices` | `plan_id`, `region`, `currency`, `amount_minor`, `interval`, `valid_from`, `valid_to` | Experimental prices are rows, not code |
| `subscriptions` | `user_id`, `plan_id`, `status`, `current_period_start`, `current_period_end`, `provider`, `provider_ref`, `cancel_at_period_end` | History kept; never updated in place without an event |
| `payments` | `id`, `user_id`, `subscription_id`, `provider`, `provider_payment_id` (unique per provider), `amount_minor`, `currency`, `status`, `idempotency_key` (unique), `raw_event` | Duplicate-event protection |
| `ai_credit_ledger` | `user_id`, `delta`, `reason`, `ref_type`, `ref_id`, `balance_after`, `expires_at` | Append-only; balance is never trusted from the client |

### Curriculum (authored content, read-mostly)

| Table | Key fields |
|---|---|
| `curricula` | `code` (`general_english`, `ielts_academic`, `ielts_general`, `sat`, `cefr`), `scoring_scheme` |
| `levels` | `curriculum_id`, `code` (A1…C2 or exam-specific), `order` |
| `modules` | `level_id`, `skill` (grammar, vocabulary, reading, …), `order` |
| `lessons` | `module_id`, `slug`, `objectives`, `estimated_minutes`, `order`, `status` |
| `exercises` | `lesson_id`, `type`, `difficulty`, `skill_tags`, `payload` (jsonb), `answer_key` (jsonb, never sent before submission) |
| `passages`, `audio_assets` | reusable reading texts and audio files with `storage_key`, `duration_ms`, `voice` |
| `vocabulary_items` | `lemma`, `pos`, `cefr`, `definition_en`, `example_en`, `audio_asset_id` |
| `*_translations` | (`entity_id`, `locale`) → translated title, explanation, gloss | One translations table per translatable entity |
| `content_versions` | `entity_type`, `entity_id`, `version`, `checksum` | Lets attempts reference the exact version answered |

### Assessment

| Table | Key fields |
|---|---|
| `assessments` | `id`, `kind` (`diagnostic`, `mock_full`, `mock_section`, `lesson_quiz`), `curriculum_id`, `time_limit_s`, `is_free` |
| `assessment_items` | `assessment_id`, `exercise_id`, `order`, `section` |
| `attempts` | `id`, `user_id`, `assessment_id` or `lesson_id`, `started_at`, `submitted_at`, `status`, `raw_score`, `scaled_score`, `scoring_scheme` |
| `attempt_answers` | `attempt_id`, `exercise_id`, `answer` (jsonb), `is_correct`, `response_ms` |
| `speaking_sessions` | `id`, `user_id`, `mode`, `personality`, `started_at`, `ended_at`, `audio_in_s`, `audio_out_s`, `transcript` (jsonb) |
| `writing_submissions` | `id`, `user_id`, `prompt_id`, `text`, `word_count`, `rule_report` (jsonb) |
| `ai_evaluations` | `id`, `subject_type`, `subject_id`, `provider`, `model`, `rubric`, `scores` (jsonb), `feedback` (jsonb), `usage_record_id` |

IELTS, SAT and CEFR results are stored with their own `scoring_scheme`; no cross-conversion is stored.

### Learning state

| Table | Key fields |
|---|---|
| `learner_profiles` | `user_id` (PK), `current_cefr`, `target_cefr`, `exam`, `target_score`, `exam_date`, `daily_minutes`, `diagnostic_attempt_id` |
| `skill_mastery` | (`user_id`, `skill_tag`) → `mastery` 0–1, `attempts`, `correct`, `avg_response_ms`, `last_seen_at` |
| `error_history` | `user_id`, `error_code` (e.g. `am-agree`), `count`, `last_seen_at`, `example` |
| `vocabulary_mastery` | (`user_id`, `vocabulary_item_id`) → `box`, `due_at`, `seen`, `correct`, `wrong` |
| `learning_plans` | `id`, `user_id`, `generated_at`, `rule_version`, `horizon_days`, `status` |
| `plan_items` | `plan_id`, `day`, `lesson_id` or `assessment_id`, `reason_code`, `status` |
| `lesson_progress` | (`user_id`, `lesson_id`) → `status`, `best_score`, `completed_at` |

### Gamification

| Table | Key fields |
|---|---|
| `xp_transactions` | `user_id`, `amount`, `source_type`, `source_id`, `created_at`; unique (`user_id`, `source_type`, `source_id`) so one activity pays once |
| `streaks` | `user_id`, `current`, `longest`, `last_active_day` (user timezone) |
| `achievements`, `user_achievements` | catalogue and unlocks |
| `missions`, `user_missions` | daily and weekly goals |
| `leaderboard_snapshots` | period, scope, ranks |
| `duels`, `duel_players` | carried over |

### Usage and operations

| Table | Key fields |
|---|---|
| `usage_records` | `id`, `user_id`, `product_code`, `session_id`, `provider`, `model`, `kind` (`llm`, `stt`, `tts`, `realtime`), `input_tokens`, `output_tokens`, `audio_in_ms`, `audio_out_ms`, `request_count`, `estimated_cost_micro_usd`, `status`, `latency_ms` |
| `provider_prices` | `provider`, `model`, `unit`, `price_micro_usd`, `valid_from` — maintained by hand from vendor price lists |
| `audit_log` | admin grants, refunds, plan changes |

## 3. Migration plan

No production data may be destroyed. Each step is separately deployable and reversible.

| Step | Action | Rollback |
|---|---|---|
| 1 | Add a migration runner and a `schema_migrations` table to the **current** SQLite database; record today's schema as migration 0 | Remove the runner; schema unchanged |
| 2 | Take a file-level backup of `/data/bandly.sqlite`; add a scheduled backup job | — |
| 3 | Provision PostgreSQL; create the target schema with migrations | Drop the new database |
| 4 | Copy script: `players` → `users` + `user_identities(provider='legacy_token')`; `xp_log` → `xp_transactions`; `payments`, `subscriptions`, `duels` carried over. Script is idempotent and verifies row counts and XP totals | Postgres is not yet read by the app |
| 5 | Dual-read period: API reads Postgres, SQLite kept read-only for one release | Switch the read path back by configuration |
| 6 | Client import: after sign-in, the browser uploads its `localStorage` profile once; the server merges (takes the maximum XP, unions SRS cards and results, keeps the server's subscription state) and marks the import done | Local data is not deleted until the server confirms |
| 7 | Remove SQLite code after one stable release; keep the final backup | Restore from backup |

**Trust rule during import:** subscription state and AI credits are never taken from the client. XP imported from the browser is capped and flagged so it cannot be used to jump a leaderboard.

## 4. Backups and recovery

- Managed Postgres daily backups plus a weekly logical dump to object storage.
- A restore drill before paid launch, with the measured recovery time written into this document.
- Content tables can be rebuilt from the repository's authored sources; user tables cannot, so they define the backup priority.
