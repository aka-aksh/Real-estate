"use client";

import { LeadStatus } from "@/types/lead";
import type { LeadStatus as LeadStatusType } from "@/types/lead";
import { useI18n } from "@/components/LanguageProvider";
import { leadStatusKeys } from "@/lib/i18n";

export default function StatusSelect({
  value,
  onChange,
}: {
  value: LeadStatusType;
  onChange: (status: LeadStatusType) => void;
}) {
  const { t } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      {t("status")}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LeadStatusType)}
        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800"
      >
        {LeadStatus.options.map((status) => <option key={status} value={status}>{t(leadStatusKeys[status])}</option>)}
      </select>
    </label>
  );
}
