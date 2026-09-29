import { type Lead, safeDefaults } from "@/types/lead";

const LEADS_KEY = "masal_leads";
const SEEDED_KEY = "masal_seeded";

/** Read all leads from localStorage. Safe for missing/corrupt data. */
export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map((p) => safeDefaults(p));
  } catch {
    return [];
  }
}

/** Get a single lead by ID. */
export function getLead(id: string): Lead | null {
  return getLeads().find((l) => l.id === id) ?? null;
}

/** Save a new lead. */
export function saveLead(lead: Lead): void {
  const leads = getLeads();
  leads.push(lead);
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

/** Update an existing lead by ID. */
export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...updates };
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  return leads[idx];
}

/** Delete a lead by ID. */
export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  localStorage.setItem(LEADS_KEY, JSON.stringify(filtered));
  return true;
}

/** Check whether seed data has already been loaded. */
export function hasSeeded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SEEDED_KEY) === "true";
}

/** Mark seed data as loaded. */
export function markSeeded(): void {
  localStorage.setItem(SEEDED_KEY, "true");
}
