# Trust-Estate - Three-minute demo

- **Before starting:** Sign in with `demo@trustestate.app` / `demo1234`, or choose Continue as demo. The demo gate is not secure authentication.

- **0:00 - Dashboard:** Show sample leads, score counts, and ranked rows under the green-glass hero.
- **0:20 - Inbox and language:** Copy an inquiry, switch to Hindi or Hinglish, and use a row to prefill intake. Paste a spreadsheet row as the alternate intake path.
- **0:50 - Lead management:** Add a lead, inspect analysis and code-computed score reasons, change its status, then return to the dashboard and show the updated status.
- **1:20 - Delete and restore:** Delete a real lead and a sample lead; when no sample leads remain, use Restore sample leads.
- **1:40 - Chat:** Ask "what should I emphasize on the call?" on one lead, then ask "make my reply more assertive" on another to show per-lead grounding.
- **2:05 - Promise Keeper:** Open a Hinglish sample, extract promises, inspect deadline status, and copy a "Keep it" draft. Visit Today to see overdue and due-soon items first.
- **2:35 - Source link and feature flag:** If configured, open the direct leads database in a new tab. Set `NEXT_PUBLIC_PROMISE_KEEPER_ENABLED=false` and restart to show the plain score-ranked Today view.
- **2:50 - Technical decision:** "The model interprets language, while code computes lead priority and promise deadlines. Groq is a fallback when Gemini fails."
