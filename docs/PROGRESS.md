# PROGRESS

## M0 (plan) ✅
- Files, design, AI-call design for Promise Keeper (two calls), callModel design documented.
- Approved with 7 changes (model names, timeouts, NEXT_PUBLIC feature flag, rateLimit.ts, JSON mode for both providers, isSample + small chat schema, deferred prompts.ts/project-profile.ts).

## M1 (skeleton) ✅
- Stack: Next.js 16.3.7 + TypeScript + Tailwind 4 + Zod 4 + Vitest 5
- Created: types/lead.ts (all Zod schemas), lib/storage.ts, lib/scoring.ts, lib/schemas.ts
- Created: data/seed-leads.ts (5 sample leads: hot, warm, cold, Hinglish, contradictory budget)
- Created: Dashboard (ranked list + summary cards + Add Lead modal), Lead detail (analysis card, score reasons, provider badge, "Lead not found" state), Today tab (stub)
- Decisions: eslint-disable for localStorage setState-in-effect (legitimate SSR constraint); seed leads use non-UUID IDs (prefixed "seed-") for easy identification; scoring.ts ready but not yet called by real AI (M2)
- All commands pass: lint ✅, test ✅, build ✅

Current milestone: M5 complete
Provider verification: Owner reports both configured model names returned JSON in JSON mode in their own terminal. Not repeated in this network-restricted sandbox.

## M1 deployment debugging
- Vercel dependency resolution failed because Vitest 5 requires `@types/node` `^22.0.0 || >=24.0.0`, while the project requested major 20.
- Updated `@types/node` to `^22.20.4` and regenerated the lockfile; clean-install dry run, lint, tests, and build pass.
- First Vercel deploy remains pending.

## M2 (implementation; provider verification pending)
- Added `lib/ai.ts`: Gemini then Groq, environment-only model names, JSON mode, Zod validation, 12-second per-provider abort timeouts, eligible single retries, and a 30-second overall cap.
- Added `/api/analyze` with request validation, in-memory rate limiting, Node runtime and 30-second route duration; scoring stays in code.
- New leads are saved before analysis, keep their form data on failure, and show Analysis pending with Retry. Lead detail supports retry, status updates, and Copy draft.
- Added project profile and analysis prompt, plus scoring and provider fallback tests.
- `npm run lint` passed; `npm test` passed (8 tests); production build passed using `MASAL_NEXT_DIST_DIR=.next/m2-validation` to avoid OneDrive reparse-point locks and with network access for the existing Google Fonts. The default `.next` build directory remains locked by OneDrive in this workspace.

## M3 (grounded chat)
- Added per-lead chat API and UI; chat stays disabled until core analysis exists and stores history with the selected lead.
- Chat uses only the selected lead, its analysis and commitments, project profile, and the recent conversation. The API validates the request and `{answer}` output.
- Retry reuses a failed question instead of duplicating it; context is capped at six recent messages.

## M4a (Promise Keeper logic)
- Added separate commitment extraction and follow-up draft routes with the shared model fallback, Zod validation, request limiting, and feature-flag checks.
- Deadline status is computed in code; unit tests cover completed, vague, overdue, due-soon, pending, timezone parsing, invalid dates, and priority ordering.

## M4b (Promise Keeper UI)
- Added commitment extraction, manual add/remove, completion tracking, buyer mood, contradictions, contact window, copyable follow-up drafts, and a kept-promises count.
- Today prioritizes overdue, then due-soon, then remaining commitments, using score to break ties. With the flag off, it shows the score-ranked lead list.
- Promise Keeper failures stay separate from core analysis. The disabled UI renders nothing.

## M5 (handoff)
- Replaced the starter README with architecture, AI/fallback behavior, setup, decisions, limitations, feature-flag, and AI-disclosure sections; added a three-minute demo script.
- Added app-level error and not-found pages and guarded localStorage reads/writes against unavailable or full storage.

## Trust-Estate continuation (Phases 5–7)
- Phase 5: dashboard refreshes after lead writes, tab focus/visibility changes, and cross-tab storage events. Status write failures show an error; status is visible in the dashboard row. Root cause was a one-time dashboard localStorage read with no subscription.
- Phase 6: lead rows and detail pages support confirmed deletion; sample deletion preserves the seed flag. Restore sample leads re-adds missing seed IDs without changing real leads.
- Phase 7: added the built-in Lead inbox, clipboard copy, one-time sessionStorage prefill, spreadsheet-row parser, optional validated leads-source link, dark dashboard hero, and English/Hindi/Hinglish strings for the new surfaces.
- Audit at the start of this continuation found demo login and AI prompt-language controls absent; the rename and some dark styling were already present.

## Trust-Estate continuation (auth, AI language, visual hardening)
- Added browser-only demo login with the `trustEstate.session` key; it does not alter or clear saved leads.
- Added optional per-request language for all four AI routes and regeneration of lead analysis in the selected language. English prompt text remains unchanged; Hindi and Hinglish receive an explicit output instruction.
- Expanded shared dark styling for legacy semantic color utilities and translated login/regeneration controls. Dictionary key parity remains tested; older screen labels still contain English literals, so full UI localization is partial.
