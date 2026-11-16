import type { Language } from "./personal";

type Localized = Record<Language, string>;

// Owner-selected month for the featured OneMind portfolio snapshot.
// Other project dates only come from the verified publication records below.
export const featuredProjectMonth = "2026-10";
export interface JourneyRecord {
  id: string;
  date: string;
  projectId: string;
  title: Localized;
  summary: Localized;
}

// Publication dates verified in docs/releases, not project inception dates.
export const journeyRecords: readonly JourneyRecord[] = [
  {
    id: "design-guidelines-published",
    date: "2026-10-10",
    projectId: "project-ai-interaction-design-guidelines",
    title: { zh: "公开 AI 交互设计指南", en: "Publishing the AI interaction design guide" },
    summary: { zh: "将个人 AI 助手的交互设计原则整理成中英文指南，加入可操作的示例。", en: "A bilingual guide to interaction principles for personal AI assistants, with examples to explore." },
  },
  {
    id: "neo-homepage-published",
    date: "2026-10-12",
    projectId: "project-neo",
    title: { zh: "NEO 项目主页上线", en: "The NEO project homepage goes live" },
    summary: { zh: "为 NEO 建立独立的项目主页，介绍这个持续陪伴、积累记忆的个人 AI。", en: "An independent homepage introducing NEO, a personal AI built around continuity and memory." },
  },
];

export function getJourney(language: Language) {
  return {
    records: [...journeyRecords].sort((a, b) => b.date.localeCompare(a.date)),
    labels: language === "zh" ? {
      title: "经历", details: "相关作品", other: "更多项目", currentSite: "当前网站",
    } : {
      title: "Journey", details: "Related work", other: "More projects", currentSite: "This website",
    },
  };
}
