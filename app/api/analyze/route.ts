import { z } from "zod/v4";
import { callModel } from "@/lib/ai";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { computeScore } from "@/lib/scoring";
import { takeRateLimit } from "@/lib/rateLimit";
import { AnalysisSchema, LeadFormSchema } from "@/types/lead";

export const runtime = "nodejs";
export const maxDuration = 30;

const RequestSchema = z.object({ form: LeadFormSchema, language: z.enum(["en", "hi", "hinglish"]).default("en") });
const AnalysisContentSchema = AnalysisSchema.omit({ provider: true });

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<Response> {
  if (!takeRateLimit(clientKey(request))) {
    return Response.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please check the lead details and try again." }, { status: 400 });
  }

  const result = await callModel(buildAnalysisPrompt(parsed.data.form, parsed.data.language), AnalysisContentSchema);
  if (!result.ok) {
    return Response.json(
      { error: result.category === "quota" ? "Free AI quota reached. Try again in a minute." : "AI analysis unavailable. Please retry." },
      { status: 503 },
    );
  }

  const analysis = AnalysisSchema.safeParse({ ...result.data, provider: result.provider });
  if (!analysis.success) {
    console.error(JSON.stringify({ category: "ai_output_validation_failure", provider: result.provider }));
    return Response.json({ error: "AI analysis unavailable. Please retry." }, { status: 503 });
  }
  return Response.json({ analysis: analysis.data, score: computeScore(analysis.data.signals) });
}
