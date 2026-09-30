"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inboundLeads } from "@/data/inbound-leads";
import { getLeadsSourceUrl } from "@/lib/leadsSource";
import { useI18n } from "@/components/LanguageProvider";

const sourceUrl = getLeadsSourceUrl(process.env.NEXT_PUBLIC_LEADS_SOURCE_URL);

export default function LeadInboxPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState("");
  const [prefillError, setPrefillError] = useState("");

  async function copyLead(index: number) {
    const lead = inboundLeads[index];
    if (!lead) return;
    const text = `Name: ${lead.name}\nLocation: ${lead.location}\nRequirement: ${lead.requirement}\nBudget: ${lead.budget || "Not specified"}\nTimeline: ${lead.timeline || "Not specified"}\nMessage: ${lead.message}`;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (copied) setCopiedIndex(index);
        else setCopyError(t("copyFailed"));
      } catch {
        setCopyError(t("copyFailed"));
      }
    }
  }

  function handleUseLead(index: number) {
    const lead = inboundLeads[index];
    if (!lead) return;
    try {
      sessionStorage.setItem("trustEstate.prefill", JSON.stringify(lead));
      router.push("/");
    } catch {
      setPrefillError(t("prefillFailed"));
    }
  }

  return <section className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Trust-Estate</p><h1 className="mt-1 text-3xl font-bold text-white">{t("inboundTitle")}</h1><p className="mt-1 text-sm text-slate-300">{t("inboundSupport")}</p></div>
      {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10">{t("openDatabase")}</a>}
    </div>
    {prefillError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-200">{prefillError}</p>}
    {copyError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-200">{copyError}</p>}
    <div className="grid gap-3 md:grid-cols-2">
      {inboundLeads.map((lead, index) => <article key={`${lead.name}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07]">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-white">{lead.name}</h2><p className="mt-1 text-sm text-slate-300">{lead.location} · {lead.requirement}</p></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">{lead.budget || "—"}</span></div>
        <p className="mt-3 text-xs text-slate-400">{lead.timeline || "Not specified"}</p><p className="mt-2 text-sm leading-6 text-slate-200">{lead.message}</p>
        <div className="mt-4 flex gap-2"><button onClick={() => void copyLead(index)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10">{copiedIndex === index ? t("copied") : t("copy")}</button><button onClick={() => handleUseLead(index)} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300">{t("useLead")}</button></div>
      </article>)}
    </div>
  </section>;
}
