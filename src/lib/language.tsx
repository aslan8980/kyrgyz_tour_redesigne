import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

type LanguageContextValue = { t: (text: string) => string };
const LanguageContext = createContext<LanguageContextValue>({ t: (text) => text });

/** The public site currently has one content language: English. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = "en";
    try {
      localStorage.setItem("kyrgyz-tours-language", "en");
    } catch {
      // The site works normally when browser storage is unavailable.
    }
  }, []);

  const value = useMemo(() => ({ t: (text: string) => text }), []);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
