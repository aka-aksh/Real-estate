import { describe, expect, it } from "vitest";
import { parsePastedLeadRow } from "@/lib/leadParser";

describe("parsePastedLeadRow", () => {
  it("parses a row without a header", () => {
    expect(parsePastedLeadRow("Asha\tPune\t2 BHK\t90L\t3 months\tWants a site visit soon")?.name).toBe("Asha");
  });

  it("skips a spreadsheet header", () => {
    expect(parsePastedLeadRow("Name\tLocation\tRequirement\tBudget\tTimeline\tMessage\nRavi\tMumbai\tVilla\t1 Cr\tNow\tKal site visit karna hai")?.message).toBe("Kal site visit karna hai");
  });

  it("rejects rows with missing columns or invalid required cells", () => {
    expect(parsePastedLeadRow("Name\tPune\t2 BHK\t90L" )).toBeNull();
    expect(parsePastedLeadRow("Asha\tPune\t2 BHK\t90L\tNow\tHey")).toBeNull();
  });
});
