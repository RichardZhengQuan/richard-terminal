"use client";

import { useState, type CSSProperties } from "react";
import type { Language } from "@/data/personal";

const cards = [
  { zh: "产品", en: "Product", details: { zh: ["应用", "SaaS 服务"], en: ["Apps", "SaaS"] }, light: "#edf3ef", dark: "#353635" },
  { zh: "设计", en: "Design", details: { zh: ["网站", "品牌"], en: ["Websites", "Brand"] }, light: "#f3eff8", dark: "#363636" },
  { zh: "商业", en: "Business", details: { zh: ["策略", "增长"], en: ["Strategy", "Growth"] }, light: "#f7f0e3", dark: "#373633" },
  { zh: "科技", en: "Technology", details: { zh: ["人工智能", "智能体"], en: ["AI", "Agents"] }, light: "#ebf0f7", dark: "#353636" },
];

function CardDrawing({ index }: { index: number }) {
  return <svg className="focus-drawing" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {index === 0 && <><rect x="35" y="35" width="130" height="130" rx="24" /><path d="M35 80h130M80 80v85" /><rect x="96" y="96" width="51" height="51" rx="10" /></>}
    {index === 1 && <><path d="M35 150C35 30 165 170 165 50" /><path d="m35 150 35-98m95-2-35 98" opacity=".4" /><circle cx="35" cy="150" r="7" /><circle cx="165" cy="50" r="7" /><rect x="64" y="46" width="12" height="12" /><rect x="124" y="142" width="12" height="12" /></>}
    {index === 2 && <><path d="M35 158h130M49 141V108h24v33m15 0V79h24v62m15 0V47h24v94" /><path d="m44 83 54-36 22 10 33-27m-20 0h20v20" /></>}
    {index === 3 && <><rect x="65" y="65" width="70" height="70" rx="12" /><rect x="83" y="83" width="34" height="34" rx="5" /><path d="M82 65V36m18 29V36m18 29V36M82 135v29m18-29v29m18-29v29M65 82H36m29 18H36m29 18H36m99-36h29m-29 18h29m-29 18h29" /></>}
  </svg>;
}

export default function FocusCards({ language }: { language: Language }) {
  const [active, setActive] = useState(0);
  const zh = language === "zh";
  return <div className="focus-deck" role="group" aria-label={zh ? "产品、设计、商业、科技卡牌" : "Product, Design, Business, Technology cards"}>
    {cards.map((card, index) => {
      const rank = (index - active + cards.length) % cards.length;
      const name = zh ? card.zh : card.en;
      const next = cards[(index + 1) % cards.length];
      return <button key={card.en} type="button" className={`focus-card${rank === 0 ? " is-front" : ""}`} style={{ "--rank": rank, "--card-light": card.light, "--card-dark": card.dark, zIndex: cards.length - rank } as CSSProperties}
        aria-label={rank === 0 ? (zh ? `${name}，点击切换到${next.zh}` : `${name}, show ${next.en}`) : (zh ? `切换到${name}` : `Show ${name}`)}
        aria-describedby={rank === 0 ? `focus-details-${index}` : undefined}
        onClick={() => setActive(current => rank === 0 ? (current + 1) % cards.length : index)}>
        <CardDrawing index={index} />
        <span className="focus-card-name" lang={zh ? "zh-CN" : "en"}>{name}</span>
        <span className="focus-card-details" id={`focus-details-${index}`}>
          {card.details[language].map(detail => <span key={detail}>{detail}</span>)}
        </span>
        <svg className="focus-next" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
      </button>;
    })}
    <span className="sr-only" role="status" aria-live="polite">{zh ? cards[active].zh : cards[active].en}</span>
  </div>;
}
