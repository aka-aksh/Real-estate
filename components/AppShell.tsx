"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { LanguageProvider, useI18n } from "@/components/LanguageProvider";
import AuthGate, { SESSION_KEY } from "@/components/AuthGate";

export default function AppShell({ children }: { children: ReactNode }) {
  return <LanguageProvider><ShellContent>{children}</ShellContent></LanguageProvider>;
}

function ShellContent({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
      if (typeof value === "object" && value !== null && typeof (value as { email?: unknown }).email === "string") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- session storage is client-only
        setEmail((value as { email: string }).email);
      }
    } catch { /* Header stays signed out when storage is unavailable. */ }
  }, [pathname]);

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* Continue to login if storage is unavailable. */ }
    setEmail("");
    router.replace("/login");
  }

  return <>
    <header className={`sticky top-0 z-30 border-b transition-colors duration-200 ${scrolled ? "border-white/10 bg-slate-950/90 shadow-lg backdrop-blur-xl" : "border-transparent bg-slate-950/50 backdrop-blur-md"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Brand />
        <div className="flex items-center gap-3 text-xs font-medium text-slate-300 sm:gap-5 sm:text-sm">
          {pathname !== "/login" && <NavLink href="/" active={pathname === "/"}>{t("dashboard")}</NavLink>}
          {pathname !== "/login" && <NavLink href="/today" active={pathname === "/today"}>{t("today")}</NavLink>}
          {pathname !== "/login" && <NavLink href="/inbox" active={pathname === "/inbox"}>{t("leadInbox")}</NavLink>}
          <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400">
            <option value="en">EN</option><option value="hi">{"\u0939\u093f\u0928\u094d\u0926\u0940"}</option><option value="hinglish">Hinglish</option>
          </select>
          {pathname !== "/login" && email && <><span className="hidden max-w-36 truncate text-xs text-slate-400 lg:block">{email}</span><button onClick={logout} className="rounded-lg border border-white/15 px-2 py-1.5 text-xs text-slate-200">{t("logout")}</button></>}
        </div>
      </nav>
    </header>
    <AuthGate>{children}</AuthGate>
  </>;
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={`border-b-2 py-1 transition hover:text-emerald-300 ${active ? "border-emerald-400 text-white" : "border-transparent text-slate-300"}`}>{children}</Link>;
}

