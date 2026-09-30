import { describe, expect, it } from "vitest";
import { getLeadsSourceUrl } from "@/lib/leadsSource";

describe("leads source URL", () => {
  it("accepts only absolute HTTP and HTTPS URLs", () => {
    expect(getLeadsSourceUrl("https://docs.google.com/spreadsheets/d/demo/edit?gid=0#gid=0")).toContain("https://");
    expect(getLeadsSourceUrl("javascript:alert(1)")).toBeNull();
    expect(getLeadsSourceUrl(undefined)).toBeNull();
  });
});
