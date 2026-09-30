"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLeads } from "@/lib/storage";
import type { Lead } from "@/types/lead";
import { sortCommitmentsForToday, statusColor, statusLabel } from "@/features/promiseKeeper/status";

const promiseKeeperEnabled = process.env.NEXT_PUBLIC_PROMISE_KEEPER_ENABLED === "true";

export default function TodayPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    setLeads(getLeads());
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="py-12 text-center text-gray-400">Loading...</p>;

  if (!promiseKeeperEnabled) {
    const ranked = [...leads].sort((a, b) => (b.score?.value ?? -1) - (a.score?.value ?? -1));
    return <main><h1 className="mb-4 text-2xl font-bold">Today</h1>
      <p className="mb-4 text-sm text-gray-500">Promise Keeper is disabled. Leads are ranked by score.</p>
      {ranked.length === 0 ? <p className="rounded border border-dashed p-8 text-center text-gray-500">No leads yet. Add a lead from the Dashboard.</p> :
        <div className="space-y-2">{ranked.map((lead) => <LeadRow key={lead.id} lead={lead} detail="Score-ranked priority" />)}</div>}
    </main>;
  }

  const commitments = leads.flatMap((lead) => (lead.promiseKeeper?.commitments ?? []).map((item) => ({
    ...item, leadId: lead.id, leadName: lead.form.name, leadScore: lead.score?.value ?? 0,
  })));
  const sorted = sortCommitmentsForToday(commitments);

  return <main><h1 className="mb-4 text-2xl font-bold">Today</h1>
    {sorted.length === 0 ? <p className="rounded border border-dashed p-8 text-center text-gray-500">No commitments yet. Open an analyzed lead and extract promises.</p> :
      <div className="space-y-2">{sorted.map((item) => <Link key={`${item.leadId}-${item.id}`} href={`/lead/${item.leadId}`} className="block rounded-lg border bg-white p-4 hover:border-blue-300">
        <div className="flex flex-wrap items-center justify-between gap-2"><strong>{item.leadName}</strong><span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[item.computedStatus]}`}>{statusLabel[item.computedStatus]}</span></div>
        <p className="mt-2 text-sm text-gray-800">{item.action}</p>
        <p className="mt-1 text-xs text-gray-500">{item.owner} · {item.deadline_text ?? "No deadline"} · Lead score {item.leadScore}</p>
      </Link>)}</div>}
  </main>;
}

function LeadRow({ lead, detail }: { lead: Lead; detail: string }) {
  return <Link href={`/lead/${lead.id}`} className="flex items-center justify-between rounded-lg border bg-white p-4 hover:border-blue-300">
    <span><strong>{lead.form.name}</strong><span className="ml-2 text-xs text-gray-500">{lead.form.location}</span></span>
    <span className="text-sm text-gray-500">{detail} · {lead.score?.value ?? "Pending"}</span>
  </Link>;
}
