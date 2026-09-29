"use client";

import Link from "next/link";
import type { Lead } from "@/types/lead";
import ScoreBadge from "./ScoreBadge";

type Props = { lead: Lead };

export default function LeadCard({ lead }: Props) {
  return (
    <Link
      href={`/lead/${lead.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900">
              {lead.form.name}
            </h3>
            {lead.isSample && (
              <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
                Sample
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {lead.form.location} · {lead.form.requirement}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {lead.form.budget || "No budget"} · {lead.status}
          </p>
        </div>
        <ScoreBadge label={lead.score?.label ?? null} value={lead.score?.value} />
      </div>
    </Link>
  );
}
