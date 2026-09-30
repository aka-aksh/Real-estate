import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Lead } from "@/types/lead";
import { LEADS_CHANGED_EVENT, getLeads, saveLead, updateLead } from "@/lib/storage";

describe("lead storage events", () => {
  let values: Map<string, string>;
  let dispatchEvent: ReturnType<typeof vi.fn>;
  let lead: Lead;

  beforeEach(() => {
    values = new Map();
    dispatchEvent = vi.fn();
    vi.stubGlobal("window", { dispatchEvent });
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    });
    lead = {
      id: "test-lead", createdAt: "2026-01-01T00:00:00.000Z",
      form: { name: "Test", location: "Pune", requirement: "2 BHK", budget: "", timeline: "", message: "Need details" },
      analysis: null, score: null, status: "New", chat: [],
    };
  });

  it("persists status updates and notifies subscribers", () => {
    saveLead(lead);
    dispatchEvent.mockClear();

    const updated = updateLead(lead.id, { status: "Contacted" });

    expect(updated?.status).toBe("Contacted");
    expect(getLeads()[0]?.status).toBe("Contacted");
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0]?.[0]).toMatchObject({ type: LEADS_CHANGED_EVENT });
  });
});
