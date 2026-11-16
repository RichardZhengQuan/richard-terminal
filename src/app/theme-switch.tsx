"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeLabels } from "@/data/resume";

type Theme = "light" | "dark";
const THEME_KEY = "richard-resume-theme";

export default function ThemeSwitch({ labels }: { labels: Pick<ResumeLabels, "lightMode" | "darkMode"> }) {
  const [theme, setTheme] = useState<Theme>("light");
  const preference = useRef<Theme | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") preference.current = saved;
    } catch { /* Switching still works without storage. */ }
    const update = () => {
      const next = preference.current ?? (query.matches ? "dark" : "light");
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    preference.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* Optional preference. */ }
  }

  return <button type="button" className="theme-switch" role="switch" aria-checked={theme === "light"} aria-label={labels.lightMode} title={theme === "light" ? labels.darkMode : labels.lightMode} onClick={toggle}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {theme === "light" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" /></> : <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />}
    </svg>
  </button>;
}
