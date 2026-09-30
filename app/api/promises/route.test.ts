import { beforeEach, describe, expect, it, vi } from "vitest";

const { callModel, takeRateLimit } = vi.hoisted(() => ({ callModel: vi.fn(), takeRateLimit: vi.fn() }));
vi.mock("@/lib/ai", () => ({ callModel }));
vi.mock("@/lib/rateLimit", () => ({ takeRateLimit }));

import { POST } from "@/app/api/promises/route";

const requestBody = {
  form: { name: "Test", location: "Pune", requirement: "Flat", budget: "", timeline: "", message: "Please send details" },
  analysis: null,
};

function request(body: unknown = requestBody) {
  return new Request("http://localhost/api/promises", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
}

describe("POST /api/promises safe errors", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_PROMISE_KEEPER_ENABLED", "true");
    takeRateLimit.mockReturnValue(true);
    callModel.mockReset();
  });

  it.each([
    ["no_key", "no_provider_key", 503],
    ["timeout", "provider_timeout", 504],
    ["http_error", "provider_error", 503],
    ["invalid_json", "invalid_output", 502],
    ["zod_fail", "invalid_output", 502],
  ] as const)("maps %s to %s", async (reason, code, status) => {
    callModel.mockResolvedValue({ ok: false, error: "safe", category: "unavailable", reason, step: "gemini" });
    const response = await POST(request());
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ ok: false, code });
  });

  it("returns flag_off as 404 without calling the model", async () => {
    vi.stubEnv("NEXT_PUBLIC_PROMISE_KEEPER_ENABLED", "false");
    const response = await POST(request());
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ ok: false, code: "flag_off" });
    expect(callModel).not.toHaveBeenCalled();
  });

  it("returns route-level safe codes for rate limit and invalid body", async () => {
    takeRateLimit.mockReturnValue(false);
    const limited = await POST(request());
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ ok: false, code: "rate_limited" });
    takeRateLimit.mockReturnValue(true);
    const badRequest = await POST(request({ nope: true }));
    expect(badRequest.status).toBe(400);
    expect(await badRequest.json()).toEqual({ ok: false, code: "bad_request" });
  });

  it("maps thrown route errors to unknown", async () => {
    callModel.mockRejectedValue(new Error("private provider details"));
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, code: "unknown" });
  });
});
