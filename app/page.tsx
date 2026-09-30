"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/types/lead";
import { getLeads, saveLead, hasSeeded, markSeeded, LEADS_CHANGED_EVENT } from "@/lib/storage";
import { seedLeads } from "@/data/seed-leads";
import LeadCard from "@/components/LeadCard";
import AddLeadModal from "@/components/AddLeadModal";

/** Sort: Hot first (by score desc), then Warm, Cold, Unscored last. */
function sortLeads(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const sa = a.score?.value ?? -1;
    const sb = b.score?.value ?? -1;
    return sb - sa;
  });
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const refreshLeads = () => setLeads(getLeads());
    // Seed on first visit
    if (!hasSeeded()) {
      for (const lead of seedLeads) {
        saveLead(lead);
      }
      markSeeded();
    }
    refreshLeads();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial localStorage hydration gates the list until client data is ready
    setLoaded(true);
    window.addEventListener("focus", refreshLeads);
    window.addEventListener("storage", refreshLeads);
    window.addEventListener(LEADS_CHANGED_EVENT, refreshLeads);
    document.addEventListener("visibilitychange", refreshLeads);
    return () => {
      window.removeEventListener("focus", refreshLeads);
      window.removeEventListener("storage", refreshLeads);
      window.removeEventListener(LEADS_CHANGED_EVENT, refreshLeads);
      document.removeEventListener("visibilitychange", refreshLeads);
    };
  }, []);

  const hot = leads.filter((l) => l.score?.label === "Hot").length;
  const warm = leads.filter((l) => l.score?.label === "Warm").length;
  const cold = leads.filter((l) => l.score?.label === "Cold").length;
  const unscored = leads.filter((l) => !l.score).length;
  const sorted = sortLeads(leads);

  if (!loaded) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          + Add Lead
        </button>
      </div>

      {/* Score summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Hot" count={hot} color="text-red-600 bg-red-50" />
        <SummaryCard
          label="Warm"
          count={warm}
          color="text-amber-600 bg-amber-50"
        />
        <SummaryCard
          label="Cold"
          count={cold}
          color="text-blue-600 bg-blue-50"
        />
        <SummaryCard
          label="Unscored"
          count={unscored}
          color="text-gray-500 bg-gray-100"
        />
      </div>

      {/* Lead list */}
      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-500">No leads yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Click &quot;+ Add Lead&quot; or refresh to load sample leads.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      <AddLeadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdded={(lead) => setLeads((prev) => prev.some((item) => item.id === lead.id)
          ? prev.map((item) => item.id === lead.id ? lead : item)
          : [...prev, lead])}
      />
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
