import { profile, type Language } from "./personal";
import { projectCategories } from "./stage";
import { getJourney } from "./journey";

export type EventKind = "work" | "project" | "education" | "honor";
export type TimelineLayout = "full" | "picture" | "gallery" | "icon";

export interface TimelineEntry {
  id: string;
  kind: EventKind;
  title: string;
  org?: string;
  orgUrl?: string;
  place?: string;
  date?: string;
  summary?: string;
  highlights?: string[];
  tags?: string[];
  url?: string;
  source?: string;
  layout?: TimelineLayout;
  images?: string[];
  caption?: string;
  quote?: string | { text: string; by?: string };
  icon?: string;
  placeholder?: boolean;
  startDate?: string;
  roles?: Array<{ id: string; title: string; scope?: string }>;
}

export interface ResumeLabels {
  about: string;
  timeline: string;
  projects: string;
  work: string;
  education: string;
  honors: string;
  skills: string;
  contact: string;
  download: string;
  pdf: string;
  updated: string;
  top: string;
  enlarge: string;
  close: string;
  skip: string;
  nav: string;
  filter: string;
  all: string;
  previous: string;
  next: string;
  previousImage: string;
  nextImage: string;
  empty: string;
  language: string;
  lightMode: string;
  darkMode: string;
  visitProject: string;
  viewSource: string;
  detailsToAdd: string;
  placeholder: string;
  currentSite: string;
  filterLabels: Record<EventKind | "all", string>;
}

export interface ResumeModel {
  language: Language;
  locale: "en-US" | "zh-CN";
  name: string;
  initials: string;
  role: string;
  tagline: string;
  about: string;
  email: string;
  website: string;
  photo?: string;
  location?: string;
  updated?: string;
  links: Array<{ label: string; url: string }>;
  facts: Array<{ label: string; value: string }>;
  timeline: TimelineEntry[];
  skills: Array<{ group: string; items: string[] }>;
  labels: ResumeLabels;
  contact: { headline: string; note: string };
  pageTitle: string;
  description: string;
}

const projectIds = [
  "onemind",
  "neo",
  "usaige",
  "clip-loop",
  "clawnest",
  "nekobar",
  "swiftui-native-design-skill",
  "ai-interaction-design-guidelines",
  "tradelens",
  "kechia",
  "iris-english",
  "a-little-theatre",
];

const copy = {
  en: {
    role: "Product | Design | Business | Technology",
    tagline: "Find the question. Make something. Grow through the attempt.",
    labels: {
      about: "About",
      timeline: "Journey",
      projects: "Projects",
      work: "Experience",
      education: "Education",
      honors: "Honors",
      skills: "Focus areas",
      contact: "Contact",
      download: "Save as PDF",
      pdf: "Save as PDF",
      updated: "Updated",
      top: "Back to top",
      enlarge: "Enlarge image",
      close: "Close",
      skip: "Skip to content",
      nav: "Main navigation",
      filter: "Filter timeline",
      all: "All",
      previous: "Previous project",
      next: "Next project",
      previousImage: "Previous image",
      nextImage: "Next image",
      empty: "No entries in this view.",
      language: "Choose language",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      visitProject: "Visit project",
      viewSource: "View source",
      detailsToAdd: "Details to add",
      placeholder: "Editable placeholder",
      currentSite: "This website",
      filterLabels: {
        all: "All",
        work: "Experience",
        project: "Projects",
        education: "Education",
        honor: "Honors",
      },
    },
    facts: [
      { label: "Focus", value: "AI tools & product systems" },
      { label: "Products", value: "Native apps & web tools" },
      { label: "Practice", value: "Observe · Build · Reflect" },
    ],
    skills: [
      { group: "Product", items: ["Apps & SaaS", "Product discovery", "From idea to launch"] },
      { group: "Design", items: ["Websites", "Brand identity", "Interaction design"] },
      { group: "Business", items: ["Strategy", "Business models", "Growth"] },
      { group: "Technology", items: ["AI tools", "Agent systems", "Developer workflows"] },
    ],
    workPlaceholder: {
      title: "Professional experience",
      summary: "Add your professional experience here. This is an editable placeholder, not a published employment record.",
      highlights: [
        "Context — add the organisation, role, dates, and product or team context.",
        "Contribution — describe the problem you owned and what you contributed.",
        "Learning — add outcomes you can support and what you learned.",
      ],
    },
    portfolioDescription: "A bilingual personal page that connects questions, breakthroughs, and the work along the way. The website you’re exploring right now.",
    contact: {
      headline: "Let’s talk about useful products.",
      note: "For a project question or a conversation about product design, AI tools, and practical software, email me or find me through the links below.",
    },
    pageTitle: "Richard Q — Product Manager & Projects",
    description: "Richard Q’s bilingual personal page and project portfolio. Explore practical AI tools, agent systems, native apps, and product design work.",
  },
  zh: {
    role: "产品 ｜ 设计 ｜ 商业 ｜ 科技",
    tagline: "把问题想明白，把想法做出来，再向前一步。",
    labels: {
      about: "关于",
      timeline: "经历",
      projects: "项目",
      work: "工作经历",
      education: "教育经历",
      honors: "荣誉",
      skills: "关注领域",
      contact: "联系",
      download: "保存为 PDF",
      pdf: "保存为 PDF",
      updated: "更新于",
      top: "回到顶部",
      enlarge: "放大图片",
      close: "关闭",
      skip: "跳转到正文",
      nav: "主导航",
      filter: "筛选时间线",
      all: "全部",
      previous: "上一个项目",
      next: "下一个项目",
      previousImage: "上一张图片",
      nextImage: "下一张图片",
      empty: "此分类暂无内容。",
      language: "选择语言",
      lightMode: "浅色模式",
      darkMode: "深色模式",
      visitProject: "访问项目",
      viewSource: "查看源码",
      detailsToAdd: "待补充信息",
      placeholder: "可编辑占位内容",
      currentSite: "当前网站",
      filterLabels: {
        all: "全部",
        work: "工作经历",
        project: "项目",
        education: "教育经历",
        honor: "荣誉",
      },
    },
    facts: [
      { label: "专注", value: "AI 工具与产品系统" },
      { label: "产品", value: "原生应用与 Web 工具" },
      { label: "修行", value: "观察 · 创造 · 沉淀" },
    ],
    skills: [
      { group: "产品", items: ["应用与 SaaS", "需求探索", "从想法到上线"] },
      { group: "设计", items: ["网站设计", "品牌视觉", "交互设计"] },
      { group: "商业", items: ["商业策略", "商业模式", "增长"] },
      { group: "科技", items: ["AI 工具", "Agent 系统", "开发者工作流"] },
    ],
    workPlaceholder: {
      title: "职业经历",
      summary: "在此补充你的职业经历。这是可编辑的占位内容，不代表已确认的任职信息。",
      highlights: [
        "背景 — 补充公司、职位、时间，以及产品或团队背景。",
        "贡献 — 说明你负责的问题，以及你具体做了什么。",
        "收获 — 补充有依据的结果，以及从中获得的经验。",
      ],
    },
    portfolioDescription: "一个以问题、突破和沿途作品串联成长的双语个人主页，就是你现在正在浏览的网站。",
    contact: {
      headline: "聊聊如何做出实用的产品。",
      note: "如果你有项目问题，或想交流产品设计、AI 工具与实用软件，可以给我发邮件，或通过下方链接找到我。",
    },
    pageTitle: "郑荃 — 产品经理与个人作品",
    description: "郑荃的双语个人主页与项目作品集，展示实用 AI 工具、Agent 系统、原生应用和产品设计。",
  },
} satisfies Record<Language, {
  role: string;
  tagline: string;
  labels: ResumeLabels;
  facts: ResumeModel["facts"];
  skills: ResumeModel["skills"];
  workPlaceholder: Pick<TimelineEntry, "title" | "summary" | "highlights">;
  portfolioDescription: string;
  contact: ResumeModel["contact"];
  pageTitle: string;
  description: string;
}>;

export function getResume(language: Language): ResumeModel {
  const c = copy[language];
  const careers: TimelineEntry[] = getJourney(language).careers.map(career => ({
    id: career.id,
    kind: "work",
    title: career.employer,
    date: career.startDate.replace("-", "."),
    startDate: career.startDate,
    roles: career.roles,
    highlights: career.roles.map(role => [role.title, role.scope].filter(Boolean).join(" · ")),
    layout: "full",
  }));
  const projects: TimelineEntry[] = profile.projects.map((project, index) => ({
    id: `project-${projectIds[index]}`,
    kind: "project",
    title: project.name,
    summary: project.name === "A Little Theatre" ? c.portfolioDescription : project.description[language],
    tags: projectCategories[index]?.[language].split(" · ") ?? [],
    url: "website" in project ? project.website : undefined,
    source: "github" in project ? project.github : undefined,
    layout: index < 2 ? "picture" : index === 6 || index === 7 ? "icon" : "full",
  }));

  return {
    language,
    locale: language === "zh" ? "zh-CN" : "en-US",
    name: profile.localizedName[language],
    initials: language === "zh" ? "郑荃" : "Rich Q",
    role: c.role,
    tagline: c.tagline,
    about: profile.about[language],
    email: profile.contact[0].value,
    website: "https://pmrichq.com/",
    links: profile.contact.map((link) => ({ label: link.label[language], url: link.href })),
    facts: c.facts,
    timeline: [
      ...careers,
      ...projects,
    ],
    skills: c.skills,
    labels: c.labels,
    contact: c.contact,
    pageTitle: c.pageTitle,
    description: c.description,
  };
}
