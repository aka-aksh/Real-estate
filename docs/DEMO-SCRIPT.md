# Three-minute demo

- **0:00 — Dashboard:** Start with the five sample leads, Hot/Warm/Cold counts, and ranked list.
- **0:20 — Intake:** Add a lead with a realistic inquiry; show that analysis starts after the lead is saved.
- **0:50 — Analysis:** Point out the summary, intent, requirements, concerns, suggested next action, response, and code-generated score reasons.
- **1:20 — Chat:** Ask “what should I emphasize on the call?” on one lead, then ask “make my reply more assertive” on a different lead to show per-lead grounding.
- **1:50 — Promise Keeper:** Open a Hinglish sample, extract promises, inspect deadline status, and copy a “Keep it” draft. Visit Today to see overdue and due-soon items first.
- **2:30 — Feature flag:** Set `NEXT_PUBLIC_PROMISE_KEEPER_ENABLED=false` and restart; Promise Keeper UI disappears and Today returns to score ranking.
- **2:45 — Technical decision:** “The model interprets language, while code computes both lead priority and deadline status. Groq is a fallback when Gemini fails.”
