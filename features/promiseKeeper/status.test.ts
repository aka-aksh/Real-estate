import { describe, expect, it } from "vitest";
import { computeCommitmentStatus, sortCommitmentsForToday } from "./status";
import type { Commitment } from "@/types/lead";

function makeCommitment(overrides: Partial<Commitment> = {}): Commitment {
  return {
    id: "c1",
    owner: "salesperson",
    action: "Send brochure",
    deadline_text: "tomorrow",
    deadline_iso: null,
    vague: false,
    confidence: "high",
    source_phrase: "I will send brochure tomorrow",
    done: false,
    done_at: null,
    edited_by_user: false,
    ...overrides,
  };
}

const NOW = new Date("2026-09-30T12:00:00+05:30").getTime();

describe("computeCommitmentStatus", () => {
  it("returns done when commitment is marked done", () => {
    expect(computeCommitmentStatus(makeCommitment({ done: true, deadline_iso: "2026-09-29T10:00:00+05:30" }), NOW)).toBe("done");
  });

  it("returns vague when deadline_iso is null", () => {
    expect(computeCommitmentStatus(makeCommitment({ vague: true, deadline_iso: null }), NOW)).toBe("vague");
  });

  it("returns overdue when deadline has passed", () => {
    expect(computeCommitmentStatus(makeCommitment({ deadline_iso: "2026-09-29T10:00:00+05:30" }), NOW)).toBe("overdue");
  });

  it("returns due_soon when deadline is within 24h", () => {
    // 6 hours from now
    const deadline = new Date(NOW + 6 * 60 * 60 * 1000).toISOString();
    expect(computeCommitmentStatus(makeCommitment({ deadline_iso: deadline }), NOW)).toBe("due_soon");
  });

  it("returns pending when deadline is more than 24h away", () => {
    const deadline = new Date(NOW + 48 * 60 * 60 * 1000).toISOString();
    expect(computeCommitmentStatus(makeCommitment({ deadline_iso: deadline }), NOW)).toBe("pending");
  });

  it("handles IST/UTC boundary — deadline at 2026-09-30T23:59:00+05:30 is due_soon at noon IST", () => {
    expect(computeCommitmentStatus(makeCommitment({ deadline_iso: "2026-09-30T23:59:00+05:30" }), NOW)).toBe("due_soon");
  });

  it("returns vague for invalid date string", () => {
    expect(computeCommitmentStatus(makeCommitment({ deadline_iso: "not-a-date" }), NOW)).toBe("vague");
  });
});

describe("sortCommitmentsForToday", () => {
  it("sorts overdue salesperson promises first", () => {
    const items = [
      { ...makeCommitment({ id: "c1", owner: "customer", deadline_iso: new Date(NOW + 2 * 60 * 60 * 1000).toISOString() }), leadId: "l1", leadName: "A" },
      { ...makeCommitment({ id: "c2", owner: "salesperson", deadline_iso: "2026-09-29T10:00:00+05:30" }), leadId: "l2", leadName: "B" },
    ];
    const sorted = sortCommitmentsForToday(items, NOW);
    expect(sorted[0].id).toBe("c2");
    expect(sorted[0].computedStatus).toBe("overdue");
  });

  it("uses the lead score to break ties after status and owner", () => {
    const items = [
      { ...makeCommitment({ id: "low" }), leadId: "l1", leadName: "Low", leadScore: 35 },
      { ...makeCommitment({ id: "high" }), leadId: "l2", leadName: "High", leadScore: 90 },
    ];
    expect(sortCommitmentsForToday(items, NOW).map((item) => item.id)).toEqual(["high", "low"]);
  });
});
