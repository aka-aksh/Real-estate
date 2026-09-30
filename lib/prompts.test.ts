import { describe, expect, it } from "vitest";
import { buildAnalysisPrompt, withLanguageInstruction } from "@/lib/prompts";

const form = { name: "A", location: "B", requirement: "Flat", budget: "", timeline: "", message: "Hello" };

describe("AI output language instructions", () => {
  it("keeps English prompts unchanged", () => {
    const baseline = buildAnalysisPrompt(form);
    expect(buildAnalysisPrompt(form, "en")).toBe(baseline);
    expect(withLanguageInstruction("prompt", "en")).toBe("prompt");
  });
  it.each([
    ["hi", "Hindi (Devanagari)"],
    ["hinglish", "Hinglish (Hindi in Roman script)"],
  ] as const)("adds the %s language instruction", (language, target) => {
    expect(withLanguageInstruction("prompt", language)).toBe(`prompt\n\nWrite ALL human-readable text values in ${target}. Keep JSON keys, enum values and dates exactly as specified in English.`);
  });
});
