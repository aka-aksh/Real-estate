# SPEC

## 1. Flow
Intake form -> AI analysis -> code-computed score -> ranked lead list -> lead detail -> grounded chat -> Promise Keeper (own feature).

## 2. Data model (types/lead.ts, one shared Zod schema)
Lead = { id (uuid), createdAt, form {name, location, requirement, budget, timeline, message<=3000 chars}, analysis|null (includes provider: "gemini"|"groq"), signals|null, score {value, label, reasons[]}|null, status (New|Contacted|Site visit scheduled|Closed), chat [{role, text, at}], promiseKeeper?|undefined }.
Old leads without optional fields must still load. Safe defaults everywhere ([] and "Not identified yet"); never .map() undefined.

## 3. Screens
Dashboard (Hot/Warm/Cold counts + ranked list + Add Lead) | Lead detail | Today tab | Empty state pointing to the seeded demo leads.
Seed 5 sample leads with saved analysis (hot, warm, cold, Hinglish, contradictory budget), clearly marked as samples. New leads always use a real AI call.

## 4. Core analysis (POST /api/analyze, through callModel)
Return JSON: { lead_summary, customer_intent (buy|rent|invest|unknown), key_requirements[], objections[], missing_info[], recommended_next_action, suggested_response, signals { timeline_urgency (immediate|within_month|1_to_3_months|later|unknown), budget_clarity (clear|vague|unknown), budget_fit (fits|below|above|unknown), requirement_clarity (clear|partial|vague), action_requests[] (site_visit|callback|pricing|brochure|none), financing_readiness (ready|needs_loan|unknown), objections_severity (none|minor|major) } }.
Gemini uses its JSON response schema; Groq uses JSON mode. Both must return the same shape, and Zod validates the result either way.
Prompt rules: instructions separate from customer text; mark facts stated/inferred/unknown; "Not provided" for missing data; reply in the customer's language (English or Hinglish); calm, honest, no false urgency, no promised discounts; JSON only.

## 5. Scoring (lib/scoring.ts, pure function, unit-tested)
urgency 0-30 | budget clarity+fit 0-20 | requirement clarity 0-20 | intent/action signals 0-30 | objection penalty up to -10. Clamp 0-100. Hot >= 70, Warm 40-69, Cold < 40. "unknown" is neutral, never a heavy penalty; it becomes a suggested qualification question. Return 2-5 human-readable reasons. Budget parsing ("90L", "1 Cr", "flexible") is best-effort; if unsure treat as unknown, never crash. Status does not affect score (document this).

## 6. Project profile (fictional, injected into every AI call)
Name, location, unit types, price range, possession info, amenities, landmarks/connectivity, financing support, typical customer concerns, explicit known limitations. Anything not in it -> "verify with the project team".

## 7. Grounded chat (POST /api/chat, through callModel)
Send ONLY the selected lead: form, message, analysis, score+reasons, project profile, that lead's chat history, new question (<=500 chars). History stored per lead ID. Same question on two leads must give different answers. Disable chat until analysis exists.

## 8. Promise Keeper (features/promiseKeeper/, isolated, flag PROMISE_KEEPER_ENABLED)
Why: leads are lost when someone forgets a promise. Separate API route + separate AI call + separate Zod validation. Small marked hook-ins only. If it fails or is off, the app works unchanged. Failure never loses the lead: show "Promise Keeper unavailable, retry".
A. Extract commitments: {id, owner (customer|salesperson), action, deadline_text|null, deadline_iso (+05:30)|null, vague, confidence (low|medium|high), source_phrase (exact quote)}.
B. Status computed in code on every page load: pending | due_soon (<24h) | overdue | done | vague.
C. Contact window {text, start_hour, end_hour} if the customer states one.
D. Today tab order: overdue salesperson promises, then due_soon, then other leads by score.
E. "Keep it" draft for a salesperson promise (separate small prompt). Vague promise -> draft proposes a specific time. Uses tone_guide.
F. Say-vs-Mean: contradictions {field, form_value, message_value, source_phrase}, shown as a warning banner.
G. Buyer mood {mood (anxious|excited|skeptical|rushed|comparing|neutral), trust_need, tone_guide, evidence_phrase}.
H. Trust meter: "Promises kept: X of Y" (simple count of salesperson promises).
I. Manual add/edit/delete/mark done; source phrase shown next to every deadline; "No promises found" when empty. Saved per commitment: done, done_at, edited_by_user.
Contract: one JSON object {"promise_keeper": {commitments[], contact_window, contradictions[], buyer_mood}}.
Prompt rules: inject current date/time/weekday in Asia/Kolkata on every call; extract only what is written, no promises -> empty array; never invent deadlines or quotes; no usable date -> vague true, deadline_iso null; Hinglish: kal/parso (decide by tense, else confidence low), agle hafte = next week, "after Diwali" -> upcoming festival date or vague; use speaker labels if present else infer with lower confidence; source_phrase exact; tone calm and honest.
Wording: loss-framed and human ("You promised Rahul the floor plan by tomorrow. Keep your word."); done = "Promise kept ✓". No pressure tactics.

## 9. Errors and UX
Loading state and disabled buttons on every AI action; readable error + Retry; entered form data preserved on failure; never show raw provider errors (log server-side only); success toasts (saved, copied, status updated). Recommended next action is the top card on lead detail; original message is shown separately from AI output; labels are text, not color alone; usable at mobile width.
Server: validate bodies and max lengths (400 without calling any model); simple in-memory rate limit; model names only in env vars; make one minimal real call to EACH provider to verify its model name before building UI.

## 9b. API failure fallback (lib/ai.ts, the only file that talks to providers)
callModel(prompt, schema) order:
1. Gemini (GEMINI_API_KEY, GEMINI_MODEL) with a 15s timeout. On timeout, 429, 5xx, or invalid JSON: wait 1s, retry once.
2. Groq (GROQ_API_KEY, GROQ_MODEL) via fetch to https://api.groq.com/openai/v1/chat/completions with JSON mode. Try once (retry once on invalid JSON).
3. Both failed: return a safe error. Never show raw provider errors.
If a provider's key is missing, skip it. Record which provider answered (analysis.provider) and show tiny text "via Gemini" or "via Groq" on the analysis card. Gemini and Groq have separate free quotas, so one outage or quota limit does not stop the app.
Lead is never lost:
- New lead analysis fails: save the lead anyway with analysis = null and status "Analysis pending". Show "AI analysis unavailable. Retry" (calls /api/analyze again for that lead). It appears in the list as Unscored, below Cold.
- Chat failure: keep the typed question, show "Couldn't get an answer. Retry".
- Promise Keeper failure: core analysis stays; show "Promise Keeper unavailable, retry".
- Quota (429) on both: "Free AI quota reached. Try again in a minute."
Log failures server-side with category and step (no secrets).
Unit tests for callModel with mocked providers: Gemini fails -> Groq used; Gemini invalid JSON -> retry then Groq; both fail -> safe error; missing Groq key -> Gemini only.

## 10. Milestones (stop and wait for "continue" after each)
M0 Plan only: files, design, AI-call design for Promise Keeper, callModel design. No code.
M1 Skeleton + types + localStorage + seeded ranked list + FIRST VERCEL DEPLOY (guide me through it).
M2 lib/ai.ts callModel with Gemini + Groq (verify both with a minimal call) + intake form + real analysis + Zod + scoring (+unit tests) + lead detail + copy response + status + analysis-failure states. Redeploy and test on production.
M3 Grounded per-lead chat.
M4a Promise Keeper: prompt + validator; generate 5 sample messages yourself (Hinglish, no-promise, vague, contradictory, normal) with expected outputs and test them; status logic + unit tests (overdue, due_soon, vague, done, timezone).
M4b Promise Keeper UI, Today tab, keep-it draft, feature flag (flag off = original app).
M5 Responsive polish, README, production test in incognito, demo script.

## 11. Test cases (on the deployed URL)
Hot buyer; vague browser; budget below range; no budget; site-visit request; needs loan; long pasted message; contradictory budget; empty/short message rejected; same chat question on two leads differs; add lead -> refresh -> persists (also status, chat, promises); wrong GEMINI key locally -> Groq answers and the card says "via Groq"; both keys wrong -> lead saved as "Analysis pending" with Retry, nothing broken saved; "tomorrow" resolves correctly; vague promise gets no invented date; no-promise message yields no fake promises; flag off restores original app; old leads open; no key in client bundle.

## 12. Deliverables
README: what it does, architecture diagram, providers and how they are called, fallback design, structured-output approach, scoring method, Promise Keeper design, local setup, env vars, deployment, known limitations (localStorage only, fictional project data, no auth, no real sending, LLM date extraction can be wrong, mood is a suggestion, trust meter is a simple count, free-tier limits, human review needed). AI usage disclosure draft. Demo script (3 min): 0:00 problem + dashboard | 0:20 add lead + analysis | 0:50 ranked list + score reasons | 1:20 grounded chat | 1:50 Promise Keeper + Today | 2:30 key decision: "LLM interprets language, code controls scoring and deadlines; a Groq fallback keeps the app up if Gemini fails" | 2:50 close. Use seeded leads so the demo never depends on a live AI call.
