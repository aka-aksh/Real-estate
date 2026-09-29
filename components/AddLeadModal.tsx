"use client";

import { useState } from "react";
import { LeadFormSchema } from "@/types/lead";
import type { Lead, LeadForm } from "@/types/lead";
import { saveLead } from "@/lib/storage";
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

  if (!open) return null;

  function update(field: keyof LeadForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
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
    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      form: result.data,
      analysis: null,
      score: null,
      status: "New",
      chat: [],
    };

    // Save lead immediately (analysis = null, will be retried later)
    saveLead(lead);
    showToast("Lead saved");
    onAdded(lead);
    setForm({ ...emptyForm });
    setErrors({});
    setSaving(false);
    onClose();
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
    { key: "message", label: "Message", required: false, multiline: true },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Add New Lead</h2>
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
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
