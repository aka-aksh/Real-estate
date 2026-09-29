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

Current milestone: M1 (Vercel deploy pending)
Next: First Vercel deploy, then M2.
