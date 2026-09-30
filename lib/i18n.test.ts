import { describe, expect, it } from "vitest";
import { en, hi, hinglish } from "@/lib/i18n";

describe("UI dictionary parity", () => {
  it("includes every English key in Hindi and Hinglish", () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(hinglish).sort()).toEqual(Object.keys(en).sort());
  });
});
