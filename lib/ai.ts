import { GoogleGenAI } from "@google/genai";
import type { z } from "zod/v4";

export type Provider = "gemini" | "groq";
export type AiFailureCategory = "quota" | "unavailable";
export type CallModelResult<T> =
  | { ok: true; data: T; provider: Provider }
  | { ok: false; category: AiFailureCategory };

type ProviderAttempt =
  | { ok: true; text: string }
  | { ok: false; category: "timeout" | "quota" | "server" | "invalid_json" | "invalid_output" | "provider_error" };
type ProviderError = Extract<ProviderAttempt, { ok: false }>["category"];
type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; category: "invalid_json" | "invalid_output" };

const PROVIDER_TIMEOUT_MS = 12_000;
const TOTAL_TIMEOUT_MS = 30_000;
const RETRY_DELAY_MS = 1_000;

function getStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return;
  const status = Number(error.status);
  return Number.isFinite(status) ? status : undefined;
}

function errorCategory(error: unknown): ProviderError {
  const status = getStatus(error);
  if (status === 429) return "quota";
  if (status !== undefined && status >= 500) return "server";
  return "provider_error";
}

async function requestGemini(prompt: string, timeoutMs: number): Promise<ProviderAttempt> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model) return { ok: false, category: "provider_error" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        abortSignal: controller.signal,
        httpOptions: { retryOptions: { attempts: 1 } },
      },
    });
    return { ok: true, text: response.text ?? "" };
  } catch (error) {
    if (controller.signal.aborted) return { ok: false, category: "timeout" };
    return { ok: false, category: errorCategory(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function requestGroq(prompt: string, timeoutMs: number): Promise<ProviderAttempt> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;
  if (!apiKey || !model) return { ok: false, category: "provider_error" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        reasoning_effort: "low",
        max_completion_tokens: 1200,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return {
        ok: false,
        category: response.status === 429 ? "quota" : response.status >= 500 ? "server" : "provider_error",
      };
    }
    const raw = await response.text();
    let body: { choices?: { message?: { content?: unknown } }[] };
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      return { ok: false, category: "invalid_json" };
    }
    if (typeof body !== "object" || body === null || !("choices" in body)) {
      return { ok: false, category: "invalid_json" };
    }
    const content = body.choices?.[0]?.message?.content;
    return { ok: true, text: typeof content === "string" ? content : "" };
  } catch {
    return { ok: false, category: controller.signal.aborted ? "timeout" : "provider_error" };
  } finally {
    clearTimeout(timer);
  }
}

function validateJson<T>(text: string, schema: z.ZodType<T>): ValidationResult<T> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, category: "invalid_json" };
  }
  const result = schema.safeParse(parsed);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, category: "invalid_output" };
}

async function pause(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function callProvider<T>(
  provider: Provider,
  prompt: string,
  schema: z.ZodType<T>,
  deadline: number,
): Promise<CallModelResult<T> | null> {
  const request = provider === "gemini" ? requestGemini : requestGroq;
  let lastCategory: ProviderError = "provider_error";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return null;
    const result = await request(prompt, Math.min(PROVIDER_TIMEOUT_MS, remaining));
    if (!result.ok) {
      lastCategory = result.category;
      logProviderFailure(provider, attempt + 1, result.category);
      if (result.category === "timeout") break;
      if (result.category !== "quota" && result.category !== "server") break;
    } else {
      const checked = validateJson(result.text, schema);
      if (checked.ok) return { ok: true, data: checked.data, provider };
      lastCategory = checked.category;
      logProviderFailure(provider, attempt + 1, checked.category);
      if (checked.category !== "invalid_json") break;
    }

    if (attempt === 0 && deadline - Date.now() > RETRY_DELAY_MS) {
      await pause(RETRY_DELAY_MS);
      continue;
    }
    break;
  }

  return lastCategory === "quota" ? { ok: false, category: "quota" } : null;
}

function logProviderFailure(provider: Provider, attempt: number, category: string): void {
  console.error(JSON.stringify({ category: "ai_provider_failure", provider, attempt, reason: category }));
}

/** Try Gemini, then Groq. Each provider gets at most one retry for approved failures. */
export async function callModel<T>(prompt: string, schema: z.ZodType<T>): Promise<CallModelResult<T>> {
  const deadline = Date.now() + TOTAL_TIMEOUT_MS;
  const gemini = await callProvider("gemini", prompt, schema, deadline);
  if (gemini?.ok) return gemini;

  const groq = await callProvider("groq", prompt, schema, deadline);
  if (groq?.ok) return groq;

  return {
    ok: false,
    category: gemini?.category === "quota" && groq?.category === "quota" ? "quota" : "unavailable",
  };
}
