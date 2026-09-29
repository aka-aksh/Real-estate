"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Lead } from "@/types/lead";
import { getLead } from "@/lib/storage";
import ScoreBadge from "@/components/ScoreBadge";
import Link from "next/link";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (params.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage reads must happen in client effects, not during SSR
      setLead(getLead(params.id));
    }
    setLoaded(true);
  }, [params.id]);

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

      <div className="mb-6 flex items-start justify-between">
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
        <ScoreBadge
          label={lead.score?.label ?? null}
          value={lead.score?.value}
        />
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
            <h2 className="text-sm font-semibold text-gray-700">
              AI Analysis
            </h2>
            <span className="text-[10px] text-gray-400">
              via {lead.analysis.provider === "gemini" ? "Gemini" : "Groq"}
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-800">
            {lead.analysis.lead_summary}
          </p>

          <div className="mb-3 rounded bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-700">
              Recommended Next Action
            </p>
            <p className="mt-1 text-sm text-blue-900">
              {lead.analysis.recommended_next_action}
            </p>
          </div>

          <div className="rounded bg-green-50 p-3">
            <p className="text-xs font-semibold text-green-700">
              Suggested Response
            </p>
            <p className="mt-1 text-sm text-green-900">
              {lead.analysis.suggested_response}
            </p>
          </div>

          {/* Score reasons */}
          {lead.score && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-600">
                Score Reasons
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                {lead.score.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mb-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-center">
          <p className="font-medium text-amber-700">Analysis pending</p>
          <p className="mt-1 text-sm text-amber-600">
            AI analysis is not yet available for this lead.
          </p>
          {/* Retry button will be wired in M2 */}
        </section>
      )}

      {/* Chat and Promise Keeper stubs will be added in M3/M4 */}
    </div>
  );
}
