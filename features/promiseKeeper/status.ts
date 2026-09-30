import type { Commitment } from "@/types/lead";

export type CommitmentStatus = "pending" | "due_soon" | "overdue" | "done" | "vague";

const DUE_SOON_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Compute deadline status in CODE, not by the model.
 * Uses IST (+05:30) for comparisons. The LLM only extracts dates as deadline_iso.
 */
export function computeCommitmentStatus(
  commitment: Commitment,
  nowMs: number = Date.now(),
): CommitmentStatus {
  if (commitment.done) return "done";
  if (commitment.vague || !commitment.deadline_iso) return "vague";

  const deadline = new Date(commitment.deadline_iso).getTime();
  if (Number.isNaN(deadline)) return "vague";

  if (nowMs > deadline) return "overdue";
  if (deadline - nowMs < DUE_SOON_MS) return "due_soon";
  return "pending";
}

/** Sort commitments for the Today tab: overdue salesperson first, then due_soon, then rest. */
export function sortCommitmentsForToday(
  commitments: (Commitment & { leadId: string; leadName: string; leadScore?: number })[],
  nowMs: number = Date.now(),
): (Commitment & { leadId: string; leadName: string; leadScore?: number; computedStatus: CommitmentStatus })[] {
  const withStatus = commitments.map((c) => ({
    ...c,
    computedStatus: computeCommitmentStatus(c, nowMs),
  }));

  const priority: Record<CommitmentStatus, number> = {
    overdue: 0,
    due_soon: 1,
    pending: 2,
    vague: 3,
    done: 4,
  };

  return withStatus.sort((a, b) => {
    // Salesperson promises first within same priority
    const pa = priority[a.computedStatus] * 10 + (a.owner === "salesperson" ? 0 : 1);
    const pb = priority[b.computedStatus] * 10 + (b.owner === "salesperson" ? 0 : 1);
    return pa - pb || (b.leadScore ?? 0) - (a.leadScore ?? 0);
  });
}

export const statusLabel: Record<CommitmentStatus, string> = {
  overdue: "Overdue",
  due_soon: "Due soon",
  pending: "Pending",
  vague: "No clear deadline",
  done: "Promise kept ✓",
};

export const statusColor: Record<CommitmentStatus, string> = {
  overdue: "text-red-700 bg-red-50",
  due_soon: "text-amber-700 bg-amber-50",
  pending: "text-blue-700 bg-blue-50",
  vague: "text-gray-600 bg-gray-100",
  done: "text-green-700 bg-green-50",
};
