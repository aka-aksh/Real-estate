import { describe, expect, it } from "vitest";
import { computeScore } from "@/lib/scoring";
import type { Signals } from "@/types/lead";

const neutralSignals: Signals = {
  timeline_urgency: "unknown",
  budget_clarity: "unknown",
  budget_fit: "unknown",
  requirement_clarity: "vague",
  action_requests: ["none"],
  financing_readiness: "unknown",
  objections_severity: "none",
};

describe("computeScore", () => {
  it("scores an urgent qualified site-visit request as Hot", () => {
    const score = computeScore({
      ...neutralSignals,
      timeline_urgency: "immediate",
      budget_clarity: "clear",
      budget_fit: "fits",
      requirement_clarity: "clear",
      action_requests: ["site_visit"],
      financing_readiness: "ready",
    });
    expect(score.label).toBe("Hot");
    expect(score.value).toBe(90);
  });

  it("keeps unknown values neutral and labels a vague lead Cold", () => {
    const score = computeScore(neutralSignals);
    expect(score.value).toBe(4);
    expect(score.label).toBe("Cold");
    expect(score.reasons.length).toBeGreaterThanOrEqual(2);
  });

  it("applies objection penalties and clamps the result", () => {
    const score = computeScore({
      ...neutralSignals,
      timeline_urgency: "immediate",
      requirement_clarity: "clear",
      action_requests: ["site_visit", "callback", "pricing"],
      financing_readiness: "ready",
      objections_severity: "major",
    });
    expect(score.value).toBe(70);
    expect(score.label).toBe("Hot");
  });

  it("does not return more than five reasons", () => {
    const score = computeScore({
      ...neutralSignals,
      timeline_urgency: "immediate",
      budget_clarity: "vague",
      budget_fit: "below",
      requirement_clarity: "partial",
      action_requests: ["site_visit", "callback", "pricing", "brochure"],
      financing_readiness: "ready",
      objections_severity: "major",
    });
    expect(score.reasons.length).toBeLessThanOrEqual(5);
  });
});
