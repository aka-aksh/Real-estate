import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod/v4";

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { callModel } from "@/lib/ai";

const AnswerSchema = z.object({ answer: z.string() });
const validAnswer = JSON.stringify({ answer: "ready" });

function groqResponse(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status });
}

describe("callModel", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");
    vi.stubEnv("GEMINI_MODEL", "test-gemini-model");
    vi.stubEnv("GROQ_API_KEY", "test-groq-key");
    vi.stubEnv("GROQ_MODEL", "test-groq-model");
    generateContent.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("falls back to Groq when Gemini returns a server error", async () => {
    const error = Object.assign(new Error("provider error"), { status: 500 });
    generateContent.mockRejectedValue(error);
    vi.mocked(fetch).mockResolvedValue(groqResponse(validAnswer));

    const result = await callModel("prompt", AnswerSchema);
    expect(result).toEqual({ ok: true, data: { answer: "ready" }, provider: "groq" });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries invalid Gemini JSON once, then falls back", async () => {
    generateContent.mockResolvedValueOnce({ text: "not json" }).mockResolvedValueOnce({ text: "still not json" });
    vi.mocked(fetch).mockResolvedValue(groqResponse(validAnswer));

    const result = await callModel("prompt", AnswerSchema);
    expect(result).toEqual({ ok: true, data: { answer: "ready" }, provider: "groq" });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("strips Markdown JSON fences and accepts plain JSON", async () => {
    generateContent.mockResolvedValueOnce({ text: '```json\n{"answer":"fenced"}\n```' });
    expect(await callModel("prompt", AnswerSchema)).toEqual({
      ok: true, data: { answer: "fenced" }, provider: "gemini",
    });
    generateContent.mockResolvedValueOnce({ text: validAnswer });
    expect(await callModel("prompt", AnswerSchema)).toEqual({
      ok: true, data: { answer: "ready" }, provider: "gemini",
    });
  });

  it("retries a Zod-invalid Gemini result once, then falls back", async () => {
    generateContent.mockResolvedValueOnce({ text: '{"wrong":"shape"}' }).mockResolvedValueOnce({ text: '{"wrong":"again"}' });
    vi.mocked(fetch).mockResolvedValue(groqResponse(validAnswer));

    const result = await callModel("prompt", AnswerSchema);
    expect(result).toEqual({ ok: true, data: { answer: "ready" }, provider: "groq" });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("does not retry Gemini after timeout and falls back to Groq", async () => {
    vi.useFakeTimers();
    generateContent.mockImplementationOnce(({ config }: { config: { abortSignal: AbortSignal } }) =>
      new Promise((_, reject) => config.abortSignal.addEventListener("abort", () => reject(new Error("aborted"))),
      ),
    );
    vi.mocked(fetch).mockResolvedValue(groqResponse(validAnswer));

    const pending = callModel("prompt", AnswerSchema);
    await vi.advanceTimersByTimeAsync(12_000);
    const result = await pending;

    expect(result).toEqual({ ok: true, data: { answer: "ready" }, provider: "groq" });
    expect(generateContent).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns a safe failure when both providers fail", async () => {
    generateContent.mockRejectedValue(new Error("provider unavailable"));
    vi.mocked(fetch).mockResolvedValue(groqResponse("", 503));

    const result = await callModel("prompt", AnswerSchema);
    expect(result).toEqual({ ok: false, error: "AI is unavailable. Please retry.", category: "unavailable", reason: "http_error", step: "groq" });
  });

  it("skips a missing provider key", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GEMINI_MODEL", "");
    vi.stubEnv("GROQ_API_KEY", "");
    vi.stubEnv("GROQ_MODEL", "");

    const result = await callModel("prompt", AnswerSchema);
    expect(result).toEqual({ ok: false, error: "AI providers are not configured.", category: "unavailable", reason: "no_key", step: "configuration" });
    expect(generateContent).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
