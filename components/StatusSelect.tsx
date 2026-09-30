"use client";

import { LeadStatus } from "@/types/lead";
import type { LeadStatus as LeadStatusType } from "@/types/lead";

export default function StatusSelect({
  value,
  onChange,
}: {
  value: LeadStatusType;
  onChange: (status: LeadStatusType) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Status
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LeadStatusType)}
        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800"
      >
        {LeadStatus.options.map((status) => <option key={status} value={status}>{status}</option>)}
      </select>
    </label>
  );
}
