"use client";

import { useEffect, useState } from "react";
import { LeadFormSchema } from "@/types/lead";
import type { Lead, LeadForm } from "@/types/lead";
import { getLeads, saveLead, hasSeeded, markSeeded, LEADS_CHANGED_EVENT } from "@/lib/storage";
import { seedLeads } from "@/data/seed-leads";
import LeadCard from "@/components/LeadCard";
import AddLeadModal from "@/components/AddLeadModal";
import { showToast } from "@/components/Toast";
import { useI18n } from "@/components/LanguageProvider";
import { getLeadsSourceUrl } from "@/lib/leadsSource";
import { computeCommitmentStatus } from "@/features/promiseKeeper/status";

const sourceUrl = getLeadsSourceUrl(process.env.NEXT_PUBLIC_LEADS_SOURCE_URL);
const promiseKeeperEnabled = process.env.NEXT_PUBLIC_PROMISE_KEEPER_ENABLED === "true";

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
  const [prefill, setPrefill] = useState<LeadForm | null>(null);
  const { t } = useI18n();

  function restoreSamples() {
    const existingIds = new Set(getLeads().map((lead) => lead.id));
    for (const sample of seedLeads) {
      if (!existingIds.has(sample.id)) saveLead(sample);
    }
    setLeads(getLeads());
    showToast(t("sampleRestored"));
  }

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
    try {
      const rawPrefill = sessionStorage.getItem("trustEstate.prefill");
      if (rawPrefill) {
        const parsedPrefill = LeadFormSchema.safeParse(JSON.parse(rawPrefill));
        if (parsedPrefill.success) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the one-time session handoff after client navigation
          setPrefill(parsedPrefill.data);
          setShowModal(true);
        }
        sessionStorage.removeItem("trustEstate.prefill");
      }
    } catch {
      try { sessionStorage.removeItem("trustEstate.prefill"); } catch { /* ignore unavailable session storage */ }
    }
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
  const realLocations = [...new Set(leads.filter((lead) => !lead.isSample).map((lead) => lead.form.location.trim()).filter(Boolean))];
  const overduePromises = leads.flatMap((lead) => lead.promiseKeeper?.commitments ?? []).filter((commitment) => computeCommitmentStatus(commitment) === "overdue").length;

  if (!loaded) {
    return <div className="py-12 text-center text-gray-400">{t("loading")}</div>;
  }

  return (
    <div className="space-y-7 pb-24 md:pb-0">
      <section className="dashboard-hero relative isolate -mx-4 overflow-hidden px-4 py-8 sm:-mx-6 sm:rounded-3xl sm:px-7 sm:py-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Trust-Estate</p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">{t("headline")}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">{t("heroSupport")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AddLeadButton onClick={() => setShowModal(true)} label={t("addLeadAction")} />
              <a href="/inbox" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:bg-white/15">{t("inboxButton")}</a>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs text-slate-100 backdrop-blur"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />{t("demoReady")}</p>
          </div>
          <aside className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">{t("todayGlance")}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <GlanceCount label={t("hot")} count={hot} color="text-rose-200" />
              <GlanceCount label={t("warm")} count={warm} color="text-amber-200" />
              <GlanceCount label={t("cold")} count={cold} color="text-sky-200" />
            </div>
            {promiseKeeperEnabled && <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-sm"><span className="flex items-center gap-2 text-slate-200"><span className="text-emerald-300" aria-hidden="true">✓</span>{t("overduePromises")}</span><span className="font-semibold text-emerald-200">{overduePromises}</span></div>}
            {realLocations.length > 0 && <><p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{t("locations")}</p><div className="mt-2 flex flex-wrap gap-2">{realLocations.map((location) => <span key={location} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200">{location}</span>)}</div></>}
          </aside>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">{t("dashboard")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">{leads.length} {t("leadCount")}</span>
          {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">{t("openDatabase")}</a>}
          <AddLeadButton onClick={() => setShowModal(true)} label={t("addLeadAction")} className="hidden md:inline-flex" />
        </div>
      </div>

      {!leads.some((lead) => lead.isSample) && (
        <button onClick={restoreSamples} className="mb-5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          {t("restoreSamples")}
        </button>
      )}

      {/* Score summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label={t("hot")} count={hot} color="text-red-600 bg-red-50" />
        <SummaryCard
          label={t("warm")}
          count={warm}
          color="text-amber-600 bg-amber-50"
        />
        <SummaryCard
          label={t("cold")}
          count={cold}
          color="text-blue-600 bg-blue-50"
        />
        <SummaryCard
          label={t("unscored")}
          count={unscored}
          color="text-gray-500 bg-gray-100"
        />
      </div>

      {/* Lead list */}
      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-300">{t("leadsEmpty")}</p>
          <AddLeadButton onClick={() => setShowModal(true)} label={t("addLeadAction")} className="mx-auto mt-5" />
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
        prefill={prefill}
        onClose={() => { setShowModal(false); setPrefill(null); }}
        onAdded={(lead) => setLeads((prev) => prev.some((item) => item.id === lead.id)
          ? prev.map((item) => item.id === lead.id ? lead : item)
          : [...prev, lead])}
      />
      <AddLeadButton onClick={() => setShowModal(true)} label={t("addLeadAction")} className="mobile-add-lead-fab md:hidden" />
    </div>
  );
}

function AddLeadButton({ onClick, label, className = "" }: { onClick: () => void; label: string; className?: string }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`primary-add-lead inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-bold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 ${className}`}>
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    <span className={className.includes("mobile-add-lead-fab") ? "fab-label" : undefined}>{label}</span>
  </button>;
}

function GlanceCount({ label, count, color }: { label: string; count: number; color: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/15 p-3"><p className={`text-2xl font-bold ${color}`}>{count}</p><p className="mt-1 text-xs text-slate-300">{label}</p></div>;
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
