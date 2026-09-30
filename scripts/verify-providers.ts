import { config } from "dotenv";
config({ path: ".env.local" });

import { GoogleGenAI } from "@google/genai";

type Provider = "GEMINI" | "GROQ";
type Category =
  | "missing_key"
  | "timeout"
  | "dns"
  | "connection"
  | "tls"
  | "http_401_403"
  | "http_404_400"
  | "http_429"
  | "http_5xx"
  | "other";

type ModelList = { ids: string[]; ok: boolean };
type ErrorParts = {
  name: string;
  message: string;
  causeCode: string | null;
  causeMessage: string | null;
  status?: number;
  category: Category;
};

const timeoutMs = 30_000;
const probePrompt = 'Return exactly this JSON object: {"ok":true}';
const secrets = [process.env.GEMINI_API_KEY, process.env.GROQ_API_KEY].filter(
  (value): value is string => Boolean(value),
);

class ProviderHttpError extends Error {
  status: number;
  shortMessage: string;

  constructor(status: number, shortMessage: string) {
    super(shortMessage || "Provider returned an HTTP error.");
    this.name = "HttpError";
    this.status = status;
    this.shortMessage = shortMessage || "Provider returned an HTTP error.";
  }
}

function object(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function sanitize(value: unknown): string {
  let text = typeof value === "string" ? value : "";
  for (const secret of secrets) text = text.split(secret).join("[redacted]");
  if (text.includes(probePrompt)) text = text.split(probePrompt).join("[redacted]");
  return text.replace(/(key|api_key|authorization)=?[^\s&]+/gi, "$1=[redacted]").slice(0, 240);
}

function shortProviderMessage(body: unknown): string {
  const root = object(body);
  const error = object(root.error);
  const message = error.message ?? root.message;
  return typeof message === "string" ? message : "";
}

function shortHttpMessage(error: unknown): string {
  const item = object(error);
  const direct = shortProviderMessage(item);
  if (direct) return direct;
  const message = item.message;
  if (typeof message === "string") {
    try {
      return shortProviderMessage(JSON.parse(message));
    } catch {
      return "";
    }
  }
  return "";
}

function statusOf(error: unknown): number | undefined {
  const item = object(error);
  const status = Number(item.status ?? object(item.response).status);
  return Number.isInteger(status) && status > 0 ? status : undefined;
}

function causeOf(error: unknown): unknown {
  return object(error).cause;
}

function causeCodeOf(error: unknown): string | undefined {
  const code = object(causeOf(error)).code ?? object(error).code;
  return typeof code === "string" ? code : undefined;
}

function categoryOf(error: unknown, status?: number, timedOut = false): Category {
  const name = String(object(error).name ?? "");
  if (timedOut || name === "AbortError" || name === "TimeoutError") return "timeout";
  if (status === 401 || status === 403) return "http_401_403";
  if (status === 400 || status === 404) return "http_404_400";
  if (status === 429) return "http_429";
  if (status !== undefined && status >= 500) return "http_5xx";

  const code = causeCodeOf(error) ?? "";
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return "dns";
  if (["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT"].includes(code)) return "connection";
  if (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code.startsWith("CERT_") ||
    code.startsWith("SELF_SIGNED")
  ) return "tls";
  return "other";
}

function errorParts(
  error: unknown,
  options: { status?: number; shortMessage?: string; timedOut?: boolean } = {},
): ErrorParts {
  const status = options.status ?? statusOf(error);
  const isHttp = status !== undefined;
  const cause = causeOf(error);
  const message = sanitize(
    isHttp ? options.shortMessage ?? object(error).shortMessage : object(error).message,
  );
  const parts: ErrorParts = {
    name: isHttp ? "HttpError" : String(object(error).name ?? "Error"),
    message: message || (isHttp ? "Provider returned an HTTP error." : "Provider request failed."),
    causeCode: null,
    causeMessage: null,
    category: categoryOf(error, status, options.timedOut),
  };
  if (status !== undefined) parts.status = status;
  if (!isHttp) {
    const causeCode = causeCodeOf(error);
    const causeMessage = sanitize(object(cause).message);
    if (causeCode) parts.causeCode = causeCode;
    if (causeMessage) parts.causeMessage = causeMessage;
  }
  return parts;
}

function printFailure(provider: Provider, error: unknown, options: { status?: number; shortMessage?: string; timedOut?: boolean; category?: Category } = {}): void {
  const parts = errorParts(error, options);
  if (options.category) parts.category = options.category;
  process.exitCode = 1;
  console.log(provider + " FAILED " + JSON.stringify(parts));
}

function missingKey(provider: Provider, variable: string): void {
  printFailure(provider, { name: "ConfigurationError", message: variable + " is not set." }, { category: "missing_key" });
}

async function requestJson(
  provider: Provider,
  url: string,
  init: RequestInit,
  signal: AbortSignal,
): Promise<{ response: Response; body: unknown }> {
  const response = await fetch(url, { ...init, signal });
  const text = await response.text();
  let body: unknown = {};
  try {
    body = JSON.parse(text);
  } catch {
    if (response.ok) throw new Error("Provider returned invalid JSON.");
  }
  if (!response.ok) {
    throw new ProviderHttpError(response.status, shortProviderMessage(body));
  }
  return { response, body };
}

async function timed<T>(provider: Provider, work: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    return await work(controller.signal);
  } catch (error) {
    const wrapped = new Error(sanitize(object(error).message) || "Provider request failed.");
    wrapped.name = String(object(error).name ?? "Error");
    (wrapped as Error & { cause?: unknown; status?: number; timedOut?: boolean }).cause = object(error).cause;
    const status = statusOf(error);
    (wrapped as Error & { status?: number }).status = status;
    if (status !== undefined) {
      wrapped.message = sanitize(shortHttpMessage(error)) || "Provider returned an HTTP error.";
      (wrapped as Error & { shortMessage?: string }).shortMessage = wrapped.message;
    }
    (wrapped as Error & { timedOut?: boolean }).timedOut = timedOut;
    throw wrapped;
  } finally {
    clearTimeout(timer);
  }
}

async function geminiModels(key: string): Promise<ModelList> {
  return timed("GEMINI", async (signal) => {
    const result = await requestJson(
      "GEMINI",
      "https://generativelanguage.googleapis.com/v1beta/models",
      { headers: { "x-goog-api-key": key } },
      signal,
    );
    const rows = (object(result.body).models ?? []) as {
      name?: string;
      supportedGenerationMethods?: string[];
    }[];
    return {
      ok: true,
      ids: rows
        .filter((row) => row.supportedGenerationMethods?.includes("generateContent"))
        .map((row) => (row.name ?? "").replace(/^models\//, ""))
        .filter(Boolean),
    };
  });
}

async function groqModels(key: string): Promise<ModelList> {
  return timed("GROQ", async (signal) => {
    const result = await requestJson(
      "GROQ",
      "https://api.groq.com/openai/v1/models",
      { headers: { Authorization: "Bearer " + key } },
      signal,
    );
    const rows = (object(result.body).data ?? []) as { id?: string }[];
    return { ok: true, ids: rows.map((row) => row.id ?? "").filter(Boolean) };
  });
}

function printModelList(provider: Provider, model: string, list: ModelList, forceAlternatives = false): void {
  const present = list.ids.includes(model);
  console.log(provider + " PREFLIGHT model_in_list=" + present);
  if (present && !forceAlternatives) return;

  const choices = list.ids.slice(0, 15);
  console.log(provider + " AVAILABLE_MODELS=" + (choices.join(", ") || "(none returned)"));
  const replacement = provider === "GEMINI"
    ? choices.find((id) => /flash/i.test(id)) ?? choices[0]
    : choices.find((id) => id === "openai/gpt-oss-20b") ?? choices[0];
  if (replacement) console.log(provider + " PROPOSED_REPLACEMENT=" + replacement);
}

async function preflightGemini(key: string, model: string): Promise<ModelList | undefined> {
  try {
    const list = await geminiModels(key);
    printModelList("GEMINI", model, list);
    return list;
  } catch (error) {
    printFailure("GEMINI", error, { timedOut: Boolean(object(error).timedOut) });
    return undefined;
  }
}

async function preflightGroq(key: string, model: string): Promise<ModelList | undefined> {
  try {
    const list = await groqModels(key);
    printModelList("GROQ", model, list);
    return list;
  } catch (error) {
    printFailure("GROQ", error, { timedOut: Boolean(object(error).timedOut) });
    return undefined;
  }
}

async function verifyGemini(key: string, model: string, models?: ModelList): Promise<void> {
  try {
    const client = new GoogleGenAI({ apiKey: key });
    const response = await timed("GEMINI", (signal) => client.models.generateContent({
      model,
      contents: probePrompt,
      config: {
        responseMimeType: "application/json",
        abortSignal: signal,
        httpOptions: { retryOptions: { attempts: 1 } },
      },
    }));
    console.log("GEMINI SUCCESS RETURNED_TEXT=" + (sanitize(response.text ?? "") || "(empty)"));
  } catch (error) {
    const info = errorParts(error, { timedOut: Boolean(object(error).timedOut) });
    printFailure("GEMINI", error, { timedOut: Boolean(object(error).timedOut) });
    if (info.category === "http_404_400" && models) printModelList("GEMINI", model, models, true);
  }
}

async function verifyGroq(key: string, model: string, models?: ModelList): Promise<void> {
  try {
    const result = await timed("GROQ", (signal) => requestJson(
      "GROQ",
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: probePrompt }],
          response_format: { type: "json_object" },
          reasoning_effort: "low",
          max_completion_tokens: 50,
        }),
      },
      signal,
    ));
    const choices = object(result.body).choices as { message?: { content?: unknown } }[] | undefined;
    console.log("GROQ SUCCESS RETURNED_TEXT=" + (sanitize(choices?.[0]?.message?.content) || "(empty)"));
  } catch (error) {
    const info = errorParts(error, { timedOut: Boolean(object(error).timedOut) });
    printFailure("GROQ", error, { timedOut: Boolean(object(error).timedOut) });
    if (info.category === "http_404_400" && models) printModelList("GROQ", model, models, true);
  }
}

async function main(): Promise<void> {
  const envNames = ["GEMINI_API_KEY", "GEMINI_MODEL", "GROQ_API_KEY", "GROQ_MODEL"] as const;
  console.log("ENV " + envNames.map((name) => name + "=" + Boolean(process.env[name])).join(" "));

  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL;
  const groqKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL;

  if (!geminiKey) missingKey("GEMINI", "GEMINI_API_KEY");
  if (!groqKey) missingKey("GROQ", "GROQ_API_KEY");

  const [gList, rList] = await Promise.all([
    geminiKey && geminiModel ? preflightGemini(geminiKey, geminiModel) : Promise.resolve(undefined),
    groqKey && groqModel ? preflightGroq(groqKey, groqModel) : Promise.resolve(undefined),
  ]);
  if (geminiKey && geminiModel) await verifyGemini(geminiKey, geminiModel, gList);
  if (groqKey && groqModel) await verifyGroq(groqKey, groqModel, rList);
}

void main().catch((error: unknown) => {
  printFailure("GEMINI", error);
});
