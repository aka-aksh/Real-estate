"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnalysisSchema, ScoreSchema } from "@/types/lead";
import type { Lead, LeadStatus } from "@/types/lead";
import { getLead, updateLead } from "@/lib/storage";
import ScoreBadge from "@/components/ScoreBadge";
import StatusSelect from "@/components/StatusSelect";
import ChatPanel from "@/components/ChatPanel";
import PromiseKeeperPanel from "@/components/PromiseKeeperPanel";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    if (params.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage reads must happen in client effects, not during SSR
      setLead(getLead(params.id));
    }
    setLoaded(true);
  }, [params.id]);

  async function retryAnalysis() {
    if (!lead) return;
    setRetrying(true);
    setAnalysisError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: lead.form }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const data = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "AI analysis unavailable. Please retry.");
      const analysis = AnalysisSchema.safeParse(data.analysis);
      const score = ScoreSchema.safeParse(data.score);
      if (!analysis.success || !score.success) throw new Error("AI analysis unavailable. Please retry.");
      const updated = { ...lead, analysis: analysis.data, score: score.data };
      updateLead(updated.id, updated);
      setLead(updated);
      showToast("Analysis saved");
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "AI analysis unavailable. Please retry.");
    } finally {
      setRetrying(false);
    }
  }

  function changeStatus(status: LeadStatus) {
    if (!lead) return;
    const updated = updateLead(lead.id, { status });
    if (updated) {
      setLead(updated);
      showToast("Status updated");
    }
  }

  async function copyDraft() {
    if (!lead?.analysis) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(lead.analysis.suggested_response);
      showToast("Draft copied");
    } catch {
      setCopyError("Could not copy the draft. Select and copy the text instead.");
    }
  }

  if (!loaded) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  if (!lead) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-gray-900">Lead not found</h2>
        <p className="mt-2 text-sm text-gray-500">
          This lead may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lead.form.name}
            {lead.isSample && (
              <span className="ml-2 rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
                Sample
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {lead.form.location} · {lead.status}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusSelect value={lead.status} onChange={changeStatus} />
          <ScoreBadge label={lead.score?.label ?? null} value={lead.score?.value} />
        </div>
      </div>

      {/* Original message */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">
          Original Message
        </h2>
        <p className="whitespace-pre-wrap text-sm text-gray-800">
          {lead.form.message || "No message provided"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>Budget: {lead.form.budget || "Not specified"}</span>
          <span>·</span>
          <span>Timeline: {lead.form.timeline || "Not specified"}</span>
          <span>·</span>
          <span>Requirement: {lead.form.requirement}</span>
        </div>
      </section>

      {/* Analysis */}
      {lead.analysis ? (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">AI Analysis</h2>
            <span className="text-[10px] text-gray-400">
              via {lead.analysis.provider === "gemini" ? "Gemini" : "Groq"}
            </span>
          </div>

          <div className="mb-3 rounded bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-700">Recommended Next Action</p>
            <p className="mt-1 text-sm text-blue-900">{lead.analysis.recommended_next_action}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-600">Lead summary:</span> <span className="text-gray-800">{lead.analysis.lead_summary}</span></div>
            <div><span className="font-medium text-gray-600">Customer intent:</span> <span className="text-gray-800 capitalize">{lead.analysis.customer_intent}</span></div>
            {lead.analysis.key_requirements.length > 0 && (
              <div><span className="font-medium text-gray-600">Key requirements:</span> <span className="text-gray-800">{lead.analysis.key_requirements.join(", ")}</span></div>
            )}
            {lead.analysis.objections.length > 0 && (
              <div><span className="font-medium text-gray-600">Objections/concerns:</span> <span className="text-gray-800">{lead.analysis.objections.join(", ")}</span></div>
            )}
          </div>

          <div className="mt-3 rounded bg-green-50 p-3">
            <p className="text-xs font-semibold text-green-700">Suggested Response</p>
            <p className="mt-1 text-sm text-green-900">{lead.analysis.suggested_response}</p>
            <button onClick={copyDraft} className="mt-2 rounded border border-green-700 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100">
              Copy draft
            </button>
            {copyError && <p role="alert" className="mt-1 text-xs text-red-700">{copyError}</p>}
          </div>

          {lead.score && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-600">Score Reasons</p>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                {lead.score.reasons.map((r, i) => (<li key={i}>{r}</li>))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mb-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-center">
          <p className="font-medium text-amber-700">Analysis pending</p>
          <p className="mt-1 text-sm text-amber-600">AI analysis is not yet available for this lead.</p>
          {analysisError && <p role="alert" className="mt-2 text-sm text-red-700">{analysisError}</p>}
          <button
            onClick={retryAnalysis}
            disabled={retrying}
            className="mt-3 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {retrying ? "Analyzing..." : "Retry analysis"}
          </button>
        </section>
      )}

      {/* Promise Keeper */}
      <div className="mb-6">
        <PromiseKeeperPanel lead={lead} onLeadUpdate={setLead} />
      </div>

      {/* Chat */}
      <div className="mb-6">
        <ChatPanel lead={lead} onLeadUpdate={setLead} />
      </div>
    </div>
  );
}

