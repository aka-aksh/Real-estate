import { z } from "zod/v4";

const MAX_FIELD_LENGTH = 1200;
const shortText = (fallback = "") => z.string().transform((value) => value.trim().slice(0, MAX_FIELD_LENGTH)).default(fallback);
const nullableText = z.preprocess(
  (value) => typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) || null : null,
  z.string().nullable().default(null),
);
const deadlineIso = z.preprocess((value) => {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  return /^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)$/.test(candidate) && !Number.isNaN(Date.parse(candidate))
    ? candidate
    : null;
}, z.string().datetime({ offset: true }).nullable().default(null));

const CommitmentItemSchema = z.preprocess((input) => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return input;
  const item = input as Record<string, unknown>;
  return { ...item, owner: item.owner ?? item.who };
}, z.object({
  id: shortText(),
  owner: z.preprocess((value) => value === "customer" || value === "salesperson" ? value : "unknown", z.enum(["customer", "salesperson", "unknown"])),
  action: z.string().transform((value) => value.trim().slice(0, MAX_FIELD_LENGTH)).pipe(z.string().min(1)),
  deadline_text: nullableText,
  deadline_iso: deadlineIso,
  vague: z.boolean().catch(true),
  confidence: z.enum(["low", "medium", "high"]).catch("low"),
  source_phrase: shortText(),
})).transform((value) => ({ ...value, vague: value.vague || value.deadline_iso === null }));

const ContactWindowSchema = z.object({
  text: shortText(),
  start_hour: z.number().finite().min(0).max(23),
  end_hour: z.number().finite().min(0).max(24),
}).optional().nullable().catch(null).default(null);

const BuyerMoodSchema = z.object({
  mood: z.enum(["anxious", "excited", "skeptical", "rushed", "comparing", "neutral"]).catch("neutral"),
  trust_need: shortText(),
  tone_guide: shortText(),
  evidence_phrase: shortText(),
}).optional().nullable().catch(null).default(null);

const ContradictionSchema = z.object({
  field: shortText(),
  form_value: shortText(),
  message_value: shortText(),
  source_phrase: shortText(),
});

export const PromiseKeeperOutputSchema = z.object({
  promise_keeper: z.object({
    commitments: z.array(z.unknown()).optional().default([]).transform((items) => items.flatMap((item, index) => {
      const parsed = CommitmentItemSchema.safeParse({ ...((typeof item === "object" && item !== null) ? item : {}), id: (item as { id?: unknown } | null)?.id || `commitment-${index + 1}` });
      return parsed.success ? [parsed.data] : [];
    })),
    contact_window: ContactWindowSchema,
    contradictions: z.array(z.unknown()).optional().default([]).transform((items) => items.flatMap((item) => {
      const parsed = ContradictionSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    })),
    buyer_mood: BuyerMoodSchema,
  }).default({ commitments: [], contact_window: null, contradictions: [], buyer_mood: null }),
});

export type PromiseKeeperModelOutput = z.infer<typeof PromiseKeeperOutputSchema>;
