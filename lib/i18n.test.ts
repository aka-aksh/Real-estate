import { describe, expect, it } from "vitest";
import { dictionaries, en, hi, hinglish } from "@/lib/i18n";

describe("UI dictionary parity", () => {
  it("includes every English key in Hindi and Hinglish", () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(hinglish).sort()).toEqual(Object.keys(en).sort());
  });

  it("uses Devanagari in Hindi values unless the value is an intentional English identifier", () => {
    const devanagari = /[\u0900-\u097f]/;
    for (const [key, value] of Object.entries(hi)) {
      const intentionalEnglish = ["Trust-Estate", "Hinglish"].some((allowed) => value === allowed || value.includes(allowed)) || /^\d+$/.test(value);
      expect(intentionalEnglish || devanagari.test(value), `${key}: ${value}`).toBe(true);
    }
  });

  it("contains no mojibake markers in any dictionary", () => {
    const mojibake = /Ã|Â|à¤|à¥|â€/;
    for (const [language, dictionary] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dictionary)) {
        expect(mojibake.test(value), `${language}.${key}: ${value}`).toBe(false);
      }
    }
  });
});
