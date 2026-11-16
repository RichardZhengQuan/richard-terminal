import type { Language } from "./personal";

type Localized = Record<Language, string>;

// Owner-selected month for the featured OneMind portfolio snapshot.
// Other project dates only come from the verified publication records below.
export const featuredProjectMonth = "2026-10";
// Curated placement within the portfolio snapshot, not project publication dates.
export const spotlightProjectIds = ["project-neo", "project-usaige"] as const;
export interface JourneyRecord {
  id: string;
  date: string;
  projectId: string;
  title: Localized;
  summary: Localized;
}

interface CareerExperience {
  id: string;
  startDate: string;
  employer: Localized;
  // Roles are newest first; promotion dates have intentionally not been assigned.
  roles: Array<{ id: string; title: Localized; scope?: Localized }>;
}

export const careerExperiences: readonly CareerExperience[] = [
  {
    id: "career-beijing-tech",
    startDate: "2020-08",
    employer: { zh: "某大厂（北京）", en: "A Big Tech Firm (Beijing)" },
    roles: [
      { id: "platform-design-expert", title: { zh: "高级产品体验设计专家", en: "Director of Product Experience" }, scope: { zh: "平台业务", en: "Platform Business" } },
      { id: "merchant-senior-designer", title: { zh: "高级产品设计师", en: "Senior Product Designer" }, scope: { zh: "商家业务", en: "Merchant Business" } },
      { id: "product-designer", title: { zh: "产品设计师", en: "Product Designer" } },
    ],
  },
];

// Start months and names supplied by the owner; no later dates or outcomes inferred.
const earlierChapters = [
  {
    id: "venture-hujiaotang", startDate: "2018-03",
    heading: { zh: "创业", en: "Startup" },
    cards: [
      { id: "hujiaotang-studio", title: { zh: "胡椒糖产品设计工作室", en: "Pepper Sugar Product Design Studio" } },
      { id: "qiketabi-company", title: { zh: "奇客塔比科技有限公司", en: "Qiketabi Technology Co., Ltd." } },
    ],
  },
  {
    id: "mentorship-su-jie", startDate: "2016-08",
    heading: { zh: "产品学习", en: "Product Mentorship" },
    cards: [
      { id: "su-jie-mentorship", title: { zh: "师从《人人都是产品经理》作者苏杰", en: "Mentored by Su Jie, author of Everyone Is a Product Manager" } },
    ],
  },
];

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
    careers: careerExperiences.map(career => ({
      id: career.id,
      startDate: career.startDate,
      employer: career.employer[language],
      roles: career.roles.map(role => ({ id: role.id, title: role.title[language], scope: role.scope?.[language] })),
    })),
    earlierChapters: earlierChapters.map(chapter => ({
      id: chapter.id, startDate: chapter.startDate,
      heading: chapter.heading[language], cards: chapter.cards.map(card => ({ id: card.id, title: card.title[language] })),
    })),
    labels: language === "zh" ? {
      title: "经历", entrepreneurship: "创业", details: "相关作品", currentSite: "当前网站",
    } : {
      title: "Journey", entrepreneurship: "Startup", details: "Related work", currentSite: "This website",
    },
  };
}
