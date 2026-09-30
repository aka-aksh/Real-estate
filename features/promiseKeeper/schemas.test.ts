import { describe, expect, it } from "vitest";
import { PromiseKeeperOutputSchema } from "@/features/promiseKeeper/schemas";

const goodCommitment = {
  id: "c1", owner: "salesperson", action: "Send floor plan", deadline_text: "Tomorrow",
  deadline_iso: "2026-10-01T14:00:00+05:30", vague: false, confidence: "high", source_phrase: "I will send it",
};

describe("Promise Keeper output tolerance", () => {
  it("coerces a bad deadline to vague/null, defaults missing arrays, ignores extras, and keeps valid items", () => {
    const result = PromiseKeeperOutputSchema.parse({
      extra_top: true,
      promise_keeper: {
        extra_nested: "ignored",
        commitments: [
          { ...goodCommitment, deadline_iso: "tomorrow" },
          goodCommitment,
          { id: "bad", owner: "customer", deadline_iso: null },
        ],
      },
    });
    expect(result.promise_keeper.commitments).toHaveLength(2);
    expect(result.promise_keeper.commitments[0]).toMatchObject({ deadline_iso: null, vague: true });
    expect(result.promise_keeper.commitments[1]).toMatchObject({ action: "Send floor plan", owner: "salesperson" });
    expect(result.promise_keeper.contradictions).toEqual([]);
    expect(result.promise_keeper.contact_window).toBeNull();
    expect(result.promise_keeper.buyer_mood).toBeNull();
    expect(result).not.toHaveProperty("extra_top");
    expect(result.promise_keeper).not.toHaveProperty("extra_nested");
  });

  it("defaults missing arrays and maps unknown speaker values to unknown", () => {
    const withoutOwner: Record<string, unknown> = { ...goodCommitment, who: "broker" };
    delete withoutOwner.owner;
    const result = PromiseKeeperOutputSchema.parse({ promise_keeper: { commitments: [withoutOwner] } });
    expect(result.promise_keeper.commitments[0]?.owner).toBe("unknown");
    expect(result.promise_keeper.contradictions).toEqual([]);
  });

  it("defaults all missing arrays and optional objects", () => {
    const result = PromiseKeeperOutputSchema.parse({ promise_keeper: {} });
    expect(result.promise_keeper).toEqual({ commitments: [], contact_window: null, contradictions: [], buyer_mood: null });
  });
});
