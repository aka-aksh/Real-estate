"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { SESSION_KEY } from "@/components/AuthGate";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function signIn(demo = false) {
    const nextEmail = demo ? "demo@trustestate.app" : email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail) || (!demo && password.length < 6)) { setError("Enter a valid email and a password with at least 6 characters."); return; }
    setBusy(true); setError("");
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ email: nextEmail, loggedInAt: new Date().toISOString() })); router.replace("/"); }
    catch { setError("Could not save this demo session. Check browser storage settings."); setBusy(false); }
  }
  return <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12"><section className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl">
    <div className="mb-7 flex justify-center"><Brand /></div><h1 className="text-center text-2xl font-bold text-white">Sign in to Trust-Estate</h1>
    <p className="mt-2 text-center text-sm text-slate-400">Demo credentials: demo@trustestate.app / demo1234</p>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-950/60 p-3 text-sm text-red-200">{error}</p>}
    <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); signIn(); }}>
      <label className="block text-sm text-slate-300">Email<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2.5 text-white" /></label>
      <label className="block text-sm text-slate-300">Password<input autoComplete="current-password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2.5 text-white" /></label>
      <button disabled={busy} className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">Sign in</button>
    </form>
    <button disabled={busy} onClick={() => signIn(true)} className="mt-3 w-full rounded-lg border-2 border-emerald-300 bg-emerald-400/15 px-4 py-3 font-bold text-emerald-200 hover:bg-emerald-400/25 disabled:opacity-50">Continue as demo</button>
  </section></main>;
}
