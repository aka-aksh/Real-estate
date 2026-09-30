"use client";

import { useEffect, useState } from "react";
import type { Lead, Commitment, PromiseKeeperData } from "@/types/lead";
import { updateLead } from "@/lib/storage";
import { computeCommitmentStatus, statusLabel, statusColor } from "@/features/promiseKeeper/status";
import { showToast } from "./Toast";
import { useI18n } from "@/components/LanguageProvider";

type Props = {
  lead: Lead;
  onLeadUpdate: (lead: Lead) => void;
};

const PK_ENABLED = process.env.NEXT_PUBLIC_PROMISE_KEEPER_ENABLED === "true";

export default function PromiseKeeperPanel({ lead, onLeadUpdate }: Props) {
  const { language } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftLoading, setDraftLoading] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [manualAction, setManualAction] = useState("");
  const [manualOwner, setManualOwner] = useState<"salesperson" | "customer">("salesperson");
  const [manualDeadline, setManualDeadline] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer clock access to avoid server/client hydration drift
    setNowMs(Date.now());
  }, []);

  if (!PK_ENABLED) return null;
  if (!lead.analysis) return null;

  const pk = lead.promiseKeeper;

  async function extractPromises() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/promises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          form: lead.form,
          analysis: lead.analysis ? { lead_summary: lead.analysis.lead_summary, customer_intent: lead.analysis.customer_intent } : null,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const data = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Promise Keeper unavailable. Retry.");

      const promiseKeeper = data.promiseKeeper as PromiseKeeperData;
      const updated = { ...lead, promiseKeeper };
      updateLead(lead.id, { promiseKeeper });
      onLeadUpdate(updated);
      showToast("Promises extracted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Promise Keeper unavailable. Retry.");
    } finally {
      setLoading(false);
    }
  }

  function toggleDone(commitmentId: string) {
    if (!pk) return;
    const commitments = pk.commitments.map((c) =>
      c.id === commitmentId
        ? { ...c, done: !c.done, done_at: !c.done ? new Date().toISOString() : null }
        : c,
    );
    const updated = { ...lead, promiseKeeper: { ...pk, commitments } };
    updateLead(lead.id, { promiseKeeper: updated.promiseKeeper });
    onLeadUpdate(updated);
    showToast(commitments.find((c) => c.id === commitmentId)?.done ? "Promise kept ✓" : "Unmarked");
  }

  function addCommitment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pk || !manualAction.trim()) return;
    const deadlineIso = manualDeadline ? `${manualDeadline}T17:00:00+05:30` : null;
    const commitment: Commitment = {
      id: `manual-${Date.now()}`, owner: manualOwner, action: manualAction.trim(),
      deadline_text: manualDeadline || null, deadline_iso: deadlineIso, vague: !manualDeadline,
      confidence: "high", source_phrase: "Added by salesperson", done: false, done_at: null, edited_by_user: true,
    };
    const promiseKeeper = { ...pk, commitments: [...pk.commitments, commitment] };
    updateLead(lead.id, { promiseKeeper });
    onLeadUpdate({ ...lead, promiseKeeper });
    setManualAction(""); setManualDeadline("");
  }

  function removeCommitment(commitmentId: string) {
    if (!pk) return;
    const promiseKeeper = { ...pk, commitments: pk.commitments.filter((item) => item.id !== commitmentId) };
    updateLead(lead.id, { promiseKeeper });
    onLeadUpdate({ ...lead, promiseKeeper });
  }

  async function generateDraft(commitment: Commitment) {
    setDraftLoading(commitment.id);
    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          commitment: { owner: commitment.owner, action: commitment.action, deadline_text: commitment.deadline_text, vague: commitment.vague },
          buyerMood: pk?.buyer_mood ?? null,
          customerName: lead.form.name,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const data = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
      if (!response.ok || typeof data.answer !== "string") throw new Error("Could not generate draft.");
      setDrafts((prev) => ({ ...prev, [commitment.id]: data.answer as string }));
    } catch {
      showToast("Could not generate draft. Retry.", "error");
    } finally {
      setDraftLoading(null);
    }
  }

  async function copyDraft(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Draft copied");
    } catch {
      showToast("Could not copy", "error");
    }
  }

  // Trust meter
  const salespersonPromises = pk?.commitments.filter((c) => c.owner === "salesperson") ?? [];
  const keptCount = salespersonPromises.filter((c) => c.done).length;

  if (!pk) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Promise Keeper</h2>
        {error && <p role="alert" className="mb-2 text-sm text-red-700">{error}</p>}
        <button
          onClick={extractPromises}
          disabled={loading}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract promises"}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Promise Keeper</h2>
        {salespersonPromises.length > 0 && (
          <span className="text-xs text-gray-500">
            Promises kept: {keptCount} of {salespersonPromises.length}
          </span>
        )}
      </div>

      {/* Buyer mood */}
      {pk.buyer_mood && (
        <div className="mb-3 rounded bg-indigo-50 px-3 py-2 text-sm">
          <span className="font-medium text-indigo-700">Mood: {pk.buyer_mood.mood}</span>
          <span className="ml-2 text-indigo-600">— {pk.buyer_mood.tone_guide}</span>
        </div>
      )}

      {/* Contradictions */}
      {pk.contradictions.length > 0 && (
        <div className="mb-3 rounded border border-amber-300 bg-amber-50 px-3 py-2">
          <p className="text-xs font-semibold text-amber-800">⚠ Say vs Mean</p>
          {pk.contradictions.map((c, i) => (
            <p key={i} className="mt-1 text-sm text-amber-700">
              {c.field}: Form says &quot;{c.form_value}&quot; but message says &quot;{c.message_value}&quot;
              <span className="ml-1 text-xs text-amber-500">(&quot;{c.source_phrase}&quot;)</span>
            </p>
          ))}
        </div>
      )}

      {/* Contact window */}
      {pk.contact_window && (
        <p className="mb-3 text-xs text-gray-500">
          Contact window: {pk.contact_window.text} ({pk.contact_window.start_hour}:00–{pk.contact_window.end_hour}:00)
        </p>
      )}

      {/* Commitments */}
      {pk.commitments.length === 0 ? (
        <p className="text-sm text-gray-400">No promises found in this conversation.</p>
      ) : (
        <div className="space-y-2">
          {pk.commitments.map((c) => {
            const status = nowMs === null ? null : computeCommitmentStatus(c, nowMs);
            return (
              <div key={c.id} className="rounded border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {status ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[status]}`}>{statusLabel[status]}</span> : <span className="text-xs text-gray-400">Checking deadline…</span>}
                      <span className="text-[10px] text-gray-400 capitalize">{c.owner}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-800">{c.action}</p>
                    {c.deadline_text && (
                      <p className="mt-0.5 text-xs text-gray-500">Deadline: {c.deadline_text}</p>
                    )}
                    <p className="mt-0.5 text-xs italic text-gray-400">&quot;{c.source_phrase}&quot;</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => toggleDone(c.id)}
                      className={`rounded px-2 py-1 text-xs font-medium ${c.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {c.done ? "✓ Done" : "Mark done"}
                    </button>
                    <button onClick={() => removeCommitment(c.id)} className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">Remove</button>
                    {c.owner === "salesperson" && !c.done && (
                      <button
                        onClick={() => generateDraft(c)}
                        disabled={draftLoading === c.id}
                        className="rounded px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        {draftLoading === c.id ? "..." : "Keep it"}
                      </button>
                    )}
                  </div>
                </div>
                {drafts[c.id] && (
                  <div className="mt-2 rounded bg-purple-50 p-2">
                    <p className="text-sm text-purple-800">{drafts[c.id]}</p>
                    <button
                      onClick={() => copyDraft(drafts[c.id])}
                      className="mt-1 text-xs font-medium text-purple-600 underline"
                    >
                      Copy draft
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <form onSubmit={addCommitment} className="mt-4 grid gap-2 rounded bg-gray-50 p-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input value={manualAction} onChange={(event) => setManualAction(event.target.value)} maxLength={300} required placeholder="Add a commitment" className="rounded border px-3 py-2 text-sm" />
        <select value={manualOwner} onChange={(event) => setManualOwner(event.target.value as "salesperson" | "customer")} className="rounded border px-2 text-sm"><option value="salesperson">Salesperson</option><option value="customer">Customer</option></select>
        <input type="date" value={manualDeadline} onChange={(event) => setManualDeadline(event.target.value)} className="rounded border px-2 text-sm" aria-label="Deadline" />
        <button className="rounded bg-purple-600 px-3 py-2 text-xs font-medium text-white">Add</button>
      </form>
      <button
        onClick={extractPromises}
        disabled={loading}
        className="mt-3 text-xs font-medium text-purple-600 hover:underline disabled:opacity-50"
      >
        {loading ? "Re-extracting..." : "Re-extract promises"}
      </button>
    </section>
  );
}
