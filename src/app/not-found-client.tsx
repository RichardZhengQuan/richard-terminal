"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

type Language = "en" | "zh";

const copy = {
  en: {
    label: "Richard Q / 404",
    title: "This page couldn’t be found.",
    description: "Return to the résumé to explore my experience and projects.",
    home: "Back to résumé",
  },
  zh: {
    label: "Richard Q / 404",
    title: "找不到这个页面。",
    description: "回到简历，继续浏览我的经历与项目。",
    home: "回到简历",
  },
};

function getLanguage(): Language {
  try {
    const saved =
      window.localStorage.getItem("richard-stage-language") ??
      window.localStorage.getItem("richard-terminal-language");
    return saved === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function subscribeToLanguage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function NotFoundClient() {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguage,
    () => "en" as Language,
  );
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return (
    <main className="not-found-stage" lang={language === "zh" ? "zh-CN" : "en"}>
      <p className="stage-label">{text.label}</p>
      <p className="not-found-number" aria-label="404">404</p>
      <h1>{text.title}</h1>
      <p>{text.description}</p>
      <Link href="/" className="text-link">
        {text.home} <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
