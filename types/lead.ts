import { z } from "zod/v4";

// --- Enums ---

export const CustomerIntent = z.enum(["buy", "rent", "invest", "unknown"]);
export type CustomerIntent = z.infer<typeof CustomerIntent>;

export const TimelineUrgency = z.enum([
  "immediate",
  "within_month",
  "1_to_3_months",
  "later",
  "unknown",
]);
export type TimelineUrgency = z.infer<typeof TimelineUrgency>;

export const BudgetClarity = z.enum(["clear", "vague", "unknown"]);
export type BudgetClarity = z.infer<typeof BudgetClarity>;

export const BudgetFit = z.enum(["fits", "below", "above", "unknown"]);
export type BudgetFit = z.infer<typeof BudgetFit>;

export const RequirementClarity = z.enum(["clear", "partial", "vague"]);
export type RequirementClarity = z.infer<typeof RequirementClarity>;

export const ActionRequest = z.enum([
  "site_visit",
  "callback",
  "pricing",
  "brochure",
  "none",
]);
export type ActionRequest = z.infer<typeof ActionRequest>;

export const FinancingReadiness = z.enum(["ready", "needs_loan", "unknown"]);
export type FinancingReadiness = z.infer<typeof FinancingReadiness>;

export const ObjectionsSeverity = z.enum(["none", "minor", "major"]);
export type ObjectionsSeverity = z.infer<typeof ObjectionsSeverity>;

export const LeadStatus = z.enum([
  "New",
  "Contacted",
  "Site visit scheduled",
  "Closed",
]);
export type LeadStatus = z.infer<typeof LeadStatus>;

export const ScoreLabel = z.enum(["Hot", "Warm", "Cold"]);
export type ScoreLabel = z.infer<typeof ScoreLabel>;

// --- Nested schemas ---

export const LeadFormSchema = z.object({
  name: z.string().trim().min(1),
  location: z.string().trim().min(1),
  requirement: z.string().trim().min(1),
  budget: z.string(),
  timeline: z.string(),
  message: z.string().trim().min(5, "Enter a message of at least 5 characters").max(3000),
});
export type LeadForm = z.infer<typeof LeadFormSchema>;

export const SignalsSchema = z.object({
  timeline_urgency: TimelineUrgency,
  budget_clarity: BudgetClarity,
  budget_fit: BudgetFit,
  requirement_clarity: RequirementClarity,
  action_requests: z.array(ActionRequest),
  financing_readiness: FinancingReadiness,
  objections_severity: ObjectionsSeverity,
});
export type Signals = z.infer<typeof SignalsSchema>;

export const AnalysisSchema = z.object({
  lead_summary: z.string(),
  customer_intent: CustomerIntent,
  key_requirements: z.array(z.string()),
  objections: z.array(z.string()),
  missing_info: z.array(z.string()),
  recommended_next_action: z.string(),
  suggested_response: z.string(),
  signals: SignalsSchema,
  provider: z.enum(["gemini", "groq"]),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

export const ScoreSchema = z.object({
  value: z.number().min(0).max(100),
  label: ScoreLabel,
  reasons: z.array(z.string()).min(2).max(5),
});
export type Score = z.infer<typeof ScoreSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
  at: z.string(), // ISO date string
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// --- Promise Keeper schemas (optional on Lead) ---

export const CommitmentSchema = z.object({
  id: z.string(),
  owner: z.enum(["customer", "salesperson", "unknown"]),
  action: z.string(),
  deadline_text: z.string().nullable(),
  deadline_iso: z.string().nullable(),
  vague: z.boolean(),
  confidence: z.enum(["low", "medium", "high"]),
  source_phrase: z.string(),
  // Client-side fields
  done: z.boolean().optional(),
  done_at: z.string().nullable().optional(),
  edited_by_user: z.boolean().optional(),
});
export type Commitment = z.infer<typeof CommitmentSchema>;

export const ContactWindowSchema = z.object({
  text: z.string(),
  start_hour: z.number(),
  end_hour: z.number(),
});
export type ContactWindow = z.infer<typeof ContactWindowSchema>;

export const ContradictionSchema = z.object({
  field: z.string(),
  form_value: z.string(),
  message_value: z.string(),
  source_phrase: z.string(),
});
export type Contradiction = z.infer<typeof ContradictionSchema>;

export const BuyerMoodSchema = z.object({
  mood: z.enum([
    "anxious",
    "excited",
    "skeptical",
    "rushed",
    "comparing",
    "neutral",
  ]),
  trust_need: z.string(),
  tone_guide: z.string(),
  evidence_phrase: z.string(),
});
export type BuyerMood = z.infer<typeof BuyerMoodSchema>;

export const PromiseKeeperSchema = z.object({
  commitments: z.array(CommitmentSchema),
  contact_window: ContactWindowSchema.nullable(),
  contradictions: z.array(ContradictionSchema),
  buyer_mood: BuyerMoodSchema.nullable(),
});
export type PromiseKeeperData = z.infer<typeof PromiseKeeperSchema>;

// --- Main Lead schema ---

export const LeadSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  form: LeadFormSchema,
  analysis: AnalysisSchema.nullable(),
  score: ScoreSchema.nullable(),
  status: LeadStatus,
  chat: z.array(ChatMessageSchema),
  promiseKeeper: PromiseKeeperSchema.optional(),
  isSample: z.boolean().optional(),
});
export type Lead = z.infer<typeof LeadSchema>;

// --- Safe defaults for backwards compat ---
export function safeDefaults(partial: Record<string, unknown>): Lead {
  return {
    id: partial.id as string,
    createdAt: (partial.createdAt as string) || new Date().toISOString(),
    form: partial.form as LeadForm,
    analysis: (partial.analysis as Analysis) || null,
    score: (partial.score as Score) || null,
    status: (partial.status as LeadStatus) || "New",
    chat: Array.isArray(partial.chat) ? (partial.chat as ChatMessage[]) : [],
    promiseKeeper: partial.promiseKeeper as PromiseKeeperData | undefined,
    isSample: (partial.isSample as boolean) || undefined,
  };
}
