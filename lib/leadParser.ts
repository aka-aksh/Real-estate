import { LeadFormSchema, type LeadForm } from "@/types/lead";

/** Parse one spreadsheet row: name, location, requirement, budget, timeline, message. */
export function parsePastedLeadRow(block: string): LeadForm | null {
  const lines = block.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) => line.trim());
  if (!lines.length) return null;
  let row = lines[0].split("\t").map((cell) => cell.trim());
  if (row[0]?.toLowerCase() === "name" && row[1]?.toLowerCase() === "location") {
    row = lines[1]?.split("\t").map((cell) => cell.trim()) ?? [];
  }
  if (row.length < 6) return null;
  const parsed = LeadFormSchema.safeParse({
    name: row[0], location: row[1], requirement: row[2], budget: row[3], timeline: row[4], message: row.slice(5).join("\t"),
  });
  return parsed.success ? parsed.data : null;
}
