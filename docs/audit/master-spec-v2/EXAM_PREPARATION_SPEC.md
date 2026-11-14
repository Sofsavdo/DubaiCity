# Exam Preparation Spec (verification list)

Legend: **[F]** verified · **[R]** recommendation · **[U]** unresolved. Nothing here is implemented.

**SAT (digital):** official College Board current specification for: number of sections/modules, timing, question counts, adaptive module routing rules, score scale and what scores are reported, allowed calculator/tools, question types (student-produced response), accessibility accommodations. Date-stamp every fact; we do not simulate adaptivity unless the routing rule is published.
**IELTS:** current official format for Academic and General Training (section timing, task rules, band-score conversion publication). IELTS conversion tables used today in `lib/band.ts` must be re-verified.
**CEFR — two separate layers:**
- *Global proficiency:* CEFR descriptors (Council of Europe CEFR + Companion Volume) used for General English levels A1–C2. Internal level labels are "CEFR-aligned", never "certified".
- *Country-specific CEFR exams:* e.g., national multilevel/CEFR exam formats used in Uzbekistan, Kazakhstan, etc. **[U]** exact formats, issuers and rules per country are unknown and must be obtained from the official issuer before any module is designed; each country gets its own `exam_format` record.
Question banks: original items only; provenance and licence recorded per item.

## Acceptance additions from source C3
Each IELTS skill offers **Learn / Practice / Exam** modes. Reading: passage+questions side by side, highlight and notes, question navigator, flag for review, timer, saved answers, per-question explanations, accuracy by question type. Listening: four sections, audio player, replay limits in exam mode, transcript only after the exercise/learn mode, spelling-error detection. Writing: Task 1/2 separate, word count, timer, draft autosave, rubric feedback labelled "AI estimate", revision history and first-vs-revised comparison. Full exam: real-exam environment, answer sheet, detailed result.
