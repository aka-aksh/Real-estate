import { z } from "zod/v4";
import { callModel } from "@/lib/ai";
import { takeRateLimit } from "@/lib/rateLimit";
import { PromiseKeeperSchema } from "@/types/lead";
import { PromiseKeeperOutputSchema } from "@/features/promiseKeeper/schemas";
import { buildPromiseKeeperPrompt } from "@/features/promiseKeeper/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const PKRequestSchema = z.object({
  language: z.enum(["en", "hi", "hinglish"]).default("en"),
  form: z.object({
    name: z.string().max(160), location: z.string().max(160), requirement: z.string().max(300),
    budget: z.string().max(120), timeline: z.string().max(120), message: z.string().max(3000),
  }),
  analysis: z.object({ lead_summary: z.string().max(1200), customer_intent: z.string().max(40) }).nullable(),
});

type FailureCode = "flag_off" | "rate_limited" | "bad_request" | "no_provider_key" | "provider_timeout" | "provider_error" | "invalid_output" | "unknown";
const statusForCode: Record<FailureCode, number> = {
  flag_off: 404, rate_limited: 429, bad_request: 400, no_provider_key: 503,
  provider_timeout: 504, provider_error: 503, invalid_output: 502, unknown: 500,
};

function failure(code: FailureCode): Response {
  return Response.json({ ok: false, code }, { status: statusForCode[code] });
}

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<Response> {
  if (process.env.NEXT_PUBLIC_PROMISE_KEEPER_ENABLED !== "true") return failure("flag_off");
  if (!takeRateLimit(clientKey(request))) return failure("rate_limited");

  let body: unknown;
  try { body = await request.json(); } catch { return failure("bad_request"); }
  const parsed = PKRequestSchema.safeParse(body);
  if (!parsed.success) return failure("bad_request");

  try {
    const result = await callModel(
      buildPromiseKeeperPrompt(parsed.data.form, parsed.data.analysis, parsed.data.language),
      PromiseKeeperOutputSchema,
    );
    if (!result.ok) {
      console.error(JSON.stringify({ category: "ai", route: "promises", step: result.step, reason: result.reason }));
      const code: FailureCode = result.reason === "no_key" ? "no_provider_key"
        : result.reason === "timeout" ? "provider_timeout"
        : result.reason === "invalid_json" || result.reason === "zod_fail" ? "invalid_output"
        : result.reason === "http_error" ? "provider_error"
        : "unknown";
      return failure(code);
    }

    const commitments = result.data.promise_keeper.commitments.map((item) => ({
      ...item, done: false, done_at: null, edited_by_user: false,
    }));
    const validated = PromiseKeeperSchema.safeParse({ ...result.data.promise_keeper, commitments });
    if (!validated.success) {
      console.error(JSON.stringify({ category: "ai", route: "promises", step: "validation", reason: "zod_fail" }));
      return failure("invalid_output");
    }
    return Response.json({ ok: true, promiseKeeper: validated.data, provider: result.provider });
  } catch {
    console.error(JSON.stringify({ category: "ai", route: "promises", step: "route", reason: "unknown" }));
    return failure("unknown");
  }
}
