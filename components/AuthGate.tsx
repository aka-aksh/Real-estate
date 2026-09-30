"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SESSION_KEY = "trustEstate.session";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    let valid = false;
    try {
      const value: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
      valid = typeof value === "object" && value !== null && typeof (value as { email?: unknown }).email === "string";
    } catch { /* Treat unavailable or malformed storage as signed out. */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted session only after hydration
    setHasSession(valid);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- finish client-only session check
    setChecked(true);
  }, [pathname]);
  useEffect(() => {
    if (!checked) return;
    if (pathname === "/login" && hasSession) router.replace("/");
    else if (pathname !== "/login" && !hasSession) router.replace("/login");
  }, [checked, hasSession, pathname, router]);
  if (!checked || (pathname === "/login" ? hasSession : !hasSession)) return <main aria-busy="true" className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">Loading…</main>;
  return children;
}
