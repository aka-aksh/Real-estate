"use client";

import { useState } from "react";
import { AnalysisSchema, LeadFormSchema, ScoreSchema } from "@/types/lead";
import type { Lead, LeadForm } from "@/types/lead";
import { getLead, saveLead, updateLead } from "@/lib/storage";
import { showToast } from "./Toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdded: (lead: Lead) => void;
};

const emptyForm: LeadForm = {
  name: "",
  location: "",
  requirement: "",
  budget: "",
  timeline: "",
  message: "",
};

export default function AddLeadModal({ open, onClose, onAdded }: Props) {
  const [form, setForm] = useState<LeadForm>({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);

  if (!open) return null;

  function update(field: keyof LeadForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setAnalysisError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = LeadFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    setAnalysisError("");
    let lead = pendingLeadId ? getLead(pendingLeadId) : null;
    if (lead) {
      lead = { ...lead, form: result.data, analysis: null, score: null };
      updateLead(lead.id, lead);
    } else {
      lead = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        form: result.data,
        analysis: null,
        score: null,
        status: "New",
        chat: [],
      };
      saveLead(lead);
      setPendingLeadId(lead.id);
    }
    onAdded(lead);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: result.data }),
      });
      const body: unknown = await response.json().catch(() => null);
      const payload = typeof body === "object" && body !== null ? body as Record<string, unknown> : {};
      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "AI analysis unavailable. Please retry.");
      }
      const analysis = AnalysisSchema.safeParse(payload.analysis);
      const score = ScoreSchema.safeParse(payload.score);
      if (!analysis.success || !score.success) throw new Error("AI analysis unavailable. Please retry.");

      const saved = { ...lead, analysis: analysis.data, score: score.data };
      updateLead(saved.id, saved);
      onAdded(saved);
      showToast("Lead analyzed and saved");
      setPendingLeadId(null);
      setForm({ ...emptyForm });
      setErrors({});
      onClose();
    } catch (error) {
      const saved = { ...lead, form: result.data, analysis: null, score: null };
      updateLead(saved.id, saved);
      onAdded(saved);
      setAnalysisError(error instanceof Error ? error.message : "AI analysis unavailable. Please retry.");
    } finally {
      setSaving(false);
    }
  }

  const fields: {
    key: keyof LeadForm;
    label: string;
    required: boolean;
    multiline?: boolean;
  }[] = [
    { key: "name", label: "Name", required: true },
    { key: "location", label: "Location", required: true },
    { key: "requirement", label: "Requirement", required: true },
    { key: "budget", label: "Budget", required: false },
    { key: "timeline", label: "Timeline", required: false },
    { key: "message", label: "Message", required: true, multiline: true },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Add New Lead</h2>
        {analysisError && (
          <div role="alert" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            <p>{analysisError} The lead is saved as Analysis pending; your entries are kept.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((f) =>
            f.multiline ? (
              <div key={f.key}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {f.label}{" "}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={form[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  rows={4}
                  maxLength={3000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors[f.key] && (
                  <p className="mt-0.5 text-xs text-red-500">{errors[f.key]}</p>
                )}
              </div>
            ) : (
              <div key={f.key}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {f.label}{" "}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors[f.key] && (
                  <p className="mt-0.5 text-xs text-red-500">{errors[f.key]}</p>
                )}
              </div>
            )
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Analyzing..." : pendingLeadId ? "Retry analysis" : "Analyze and save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
