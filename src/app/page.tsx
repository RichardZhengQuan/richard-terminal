"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getResume, type TimelineEntry } from "@/data/resume";
import type { Language } from "@/data/personal";
import ThemeSwitch from "./theme-switch";
import JourneyPath from "./journey-path";
import FocusCards from "./focus-cards";

const LANGUAGE_KEY = "richard-stage-language";

function ExternalLink({ href, children, className = "u" }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(href);
  return <a className={className} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>;
}

function Block({ id, title, count, aside, className = "", children }: { id: string; title: string; count?: number; aside?: ReactNode; className?: string; children: ReactNode }) {
  return <section className={`block ${className}`} id={id} aria-labelledby={`${id}-h`}>
    <div className="block-head reveal"><h2 className="label" id={`${id}-h`}>{title}{count !== undefined && <span className="count">{String(count).padStart(2, "0")}</span>}</h2>{aside}</div>
    {children}
  </section>;
}

function EntryMeta({ entry }: { entry: TimelineEntry }) {
  return entry.org || entry.place ? <p className="entry-meta">{entry.org && (entry.orgUrl ? <ExternalLink href={entry.orgUrl}>{entry.org}</ExternalLink> : entry.org)}{entry.org && entry.place ? " · " : ""}{entry.place}</p> : null;
}

function EntryBody({ entry }: { entry: TimelineEntry }) {
  return <>
    {entry.summary && <p className="entry-desc">{entry.summary}</p>}
    {entry.highlights?.length ? <ul className="bullets">{entry.highlights.map(text => <li key={text}>{text}</li>)}</ul> : null}
    {entry.tags?.length ? <p className="tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</p> : null}
  </>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const model = useMemo(() => getResume(language), [language]);
  const labels = model.labels;
  const socialLinks = model.links.filter(link => !link.url.startsWith("mailto:"));

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem("richard-terminal-language");
      if (saved === "en" || saved === "zh") setLanguage(saved);
    } catch { /* The page works when storage is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Optional preference. */ }
    document.documentElement.lang = model.locale;
    document.title = model.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", model.description);
  }, [language, ready, model]);

  return <div className="resume-page">
    <div className="page-backdrop" aria-hidden="true"><p className="ghost">{model.name}</p></div>
    <a className="skip" href="#cv">{labels.skip}</a>
    <header className={`top${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href="#top">{model.name}</a>
      <nav className="nav" aria-label={labels.nav}>
        <div className="nav-row" id="nav-links"><a href={`mailto:${model.email}`}>{language === "zh" ? "邮箱" : "Email"}</a>{socialLinks.map(link => <ExternalLink key={link.url} href={link.url} className="">{link.label}</ExternalLink>)}</div>
        <div className="nav-row" id="nav-preferences">
          <span className="language-switch" role="group" aria-label={labels.language}><button type="button" lang="en" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button><span aria-hidden="true">/</span><button type="button" lang="zh-CN" aria-pressed={language === "zh"} onClick={() => setLanguage("zh")}>中文</button></span>
          <ThemeSwitch labels={labels} />
        </div>
      </nav>
    </header>

    <section className="intro" id="top" aria-labelledby="intro-name">
      <div className="intro-in">
        <div className="intro-text">
          <h1 className="intro-name" id="intro-name">{model.name}</h1>
          <p className="intro-role">{[model.role, model.location].filter(Boolean).join(" · ")}</p>
        </div>
        <FocusCards language={language} />
      </div>
    </section>

    <header className="print-head"><p className="ph-name">{model.name}</p><p className="ph-role">{model.role}</p><p className="ph-meta">{model.location && <span>{model.location}</span>}<span>{model.email}</span><span>{model.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>{socialLinks.map(link => <span key={link.url}>{link.url.replace(/^https?:\/\//, "")}</span>)}</p></header>
    <main className="cv" id="cv" tabIndex={-1}>
      <Block id="cv-about" title={labels.about} className="print-only"><p className="lede">{model.about}</p></Block>
      <JourneyPath model={model} />

      {(["work", "project", "education", "honor"] as const).filter(kind => model.timeline.some(entry => entry.kind === kind && !entry.placeholder)).map(kind => <Block key={kind} id={`cv-${kind}`} title={labels.filterLabels[kind]} className="print-only">
        {kind === "project" || kind === "honor" ? <ol className="plates">{model.timeline.filter(entry => entry.kind === kind && !entry.placeholder).map((entry, index) => <li className="row" key={entry.id}><span className="num">{String(index + 1).padStart(2, "0")}</span><span><span className="phead"><span className="ptitle">{entry.title}</span>{entry.org && <span className="pkind">{entry.org}</span>}</span>{entry.summary && <span className="psum">{entry.summary}</span>}</span><span className="pyear">{entry.date ?? ""}</span></li>)}</ol> : <ol className="entries">{model.timeline.filter(entry => entry.kind === kind && !entry.placeholder).map(entry => <li className="entry" key={entry.id}><p className="when">{entry.date ?? ""}</p><div><h3 className="entry-title">{entry.title}</h3><EntryMeta entry={entry} /><EntryBody entry={entry} /></div></li>)}</ol>}
      </Block>)}

      <Block id="skills" title={labels.skills}><dl className="skills">{model.skills.map(skill => <div className="skill reveal" key={skill.group}><dt>{skill.group}</dt><dd>{skill.items.map(item => <span key={item}>{item}</span>)}</dd></div>)}</dl></Block>
      <Block id="contact" title={labels.contact}><p className="contact-line reveal">{model.contact.headline}<br /><a href={`mailto:${model.email}`}>{model.email}</a></p><p className="contact-note reveal">{model.contact.note}</p><p className="contact-links reveal">{socialLinks.map(link => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}</p></Block>
    </main>
    <footer className="foot"><div className="foot-in"><span>© {new Date().getFullYear()} {model.name}</span>{model.updated && <span>{labels.updated} {model.updated}</span>}<a href="#top">{labels.top} ↑</a></div></footer>
  </div>;
}
