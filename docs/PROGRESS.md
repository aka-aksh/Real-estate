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

Current milestone: M2 (implementation complete; provider verification pending)
Next: Confirm both provider calls from a network that can reach their APIs, then continue to M3.

## M1 deployment debugging
- Vercel dependency resolution failed because Vitest 5 requires `@types/node` `^22.0.0 || >=24.0.0`, while the project requested major 20.
- Updated `@types/node` to `^22.20.4` and regenerated the lockfile; clean-install dry run, lint, tests, and build pass.
- First Vercel deploy remains pending.

## M2 (implementation; provider verification pending)
- Added `lib/ai.ts`: Gemini then Groq, environment-only model names, JSON mode, Zod validation, 12-second per-provider abort timeouts, eligible single retries, and a 30-second overall cap.
- Added `/api/analyze` with request validation, in-memory rate limiting, Node runtime and 30-second route duration; scoring stays in code.
- New leads are saved before analysis, keep their form data on failure, and show Analysis pending with Retry. Lead detail supports retry, status updates, and Copy draft.
- Added project profile and analysis prompt, plus scoring and provider fallback tests.
- Minimal real calls using the configured model names both failed with category `network_or_timeout`; no model name failure was returned, so no model list or replacement was indicated.
- `npm run lint` passed; `npm test` passed (8 tests); production build passed using `MASAL_NEXT_DIST_DIR=.next/m2-validation` to avoid OneDrive reparse-point locks and with network access for the existing Google Fonts. The default `.next` build directory remains locked by OneDrive in this workspace.
