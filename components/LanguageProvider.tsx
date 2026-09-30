"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type Language, type TranslationKey } from "@/lib/i18n";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_KEY = "trustEstate.lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "hi" || stored === "hinglish" || stored === "en") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved language only after hydration
        setCurrentLanguage(stored);
      }
    } catch { /* keep English if browser storage is disabled */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setCurrentLanguage(next);
    try { localStorage.setItem(LANG_KEY, next); } catch { /* language still changes for this visit */ }
  }, []);

  const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => dictionaries[language][key] ?? dictionaries.en[key] }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used inside LanguageProvider");
  return value;
}
