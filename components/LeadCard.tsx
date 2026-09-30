"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lead } from "@/types/lead";
import { deleteLead } from "@/lib/storage";
import ScoreBadge from "./ScoreBadge";
import ConfirmDialog from "./ConfirmDialog";
import { showToast } from "./Toast";
import { useI18n } from "@/components/LanguageProvider";
import { leadStatusKeys } from "@/lib/i18n";

type Props = { lead: Lead };

export default function LeadCard({ lead }: Props) {
  const { t } = useI18n();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    if (deleteLead(lead.id)) showToast(t("leadDeleted"));
    else showToast(t("failedDelete"), "error");
    setConfirmDelete(false);
  }

  return (
    <article className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/lead/${lead.id}`} className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-gray-900">{lead.form.name}</h3>
              {lead.isSample && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">{t("sample")}</span>}
            </div>
            <p className="mt-0.5 truncate text-sm text-gray-500">{lead.form.location} · {lead.form.requirement}</p>
            <p className="mt-1 text-xs text-gray-500">{lead.form.budget || "No budget"} · {t("status")}: {t(leadStatusKeys[lead.status])}</p>
          </div>
          <ScoreBadge label={lead.score?.label ?? null} value={lead.score?.value} />
        </div>
      </Link>
      <button type="button" aria-label={`${t("deleteLeadLabel")} ${lead.form.name}`} onClick={() => setConfirmDelete(true)} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3" /></svg>
      </button>
      <ConfirmDialog open={confirmDelete} onCancel={() => setConfirmDelete(false)} onConfirm={handleDelete} />
    </article>
  );
}
