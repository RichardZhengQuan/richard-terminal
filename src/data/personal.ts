export type Language = "en" | "zh";
export type CommandKey = "help" | "about" | "projects" | "now" | "contact";

type LocalizedText = Record<Language, string>;

export type Project = {
  name: string;
  description: LocalizedText;
  website?: string;
  github?: string;
};

export const profile = {
  name: "Richard",
  title: {
    en: "Product manager building practical AI tools and product systems.",
    zh: "产品经理，专注于 AI 工具和产品系统。",
  },
  intro: {
    en: ["Hello. I’m Richard.", "Public terminal ready.", "Run /help or select a command below."],
    zh: ["你好，我是 Richard。", "公开终端已就绪。", "输入 /帮助，或选择下方命令。"],
  },
  about: {
    en: "I’m Richard, a product manager focused on AI tools, agent systems, product design, and practical software.",
    zh: "我是 Richard，一名产品经理，专注于 AI 工具、Agent 系统、产品设计和实用软件。",
  },
  now: {
    en: "Current focus: refining practical AI tools, native macOS and iOS apps, and this public terminal.",
    zh: "当前重点：持续打磨实用 AI 工具、macOS 与 iOS 原生应用，以及这个公开终端。",
  },
  projects: [
    {
      name: "Clip Loop",
      website: "https://pmrichq.com/project/cliploop/",
      github: "https://github.com/RichardZhengQuan/Cliploop",
      description: {
        en: "Native macOS and iOS study app for caption-based clips and looped playback.",
        zh: "macOS 与 iOS 原生学习应用，支持字幕片段和循环播放。",
      },
    },
    {
      name: "ClawNest",
      github: "https://github.com/RichardZhengQuan/ClawNest",
      description: {
        en: "macOS control center for monitoring and recovering a local OpenClaw runtime.",
        zh: "用于监控和修复本地 OpenClaw 运行环境的 macOS 控制中心。",
      },
    },
    {
      name: "NekoBar",
      github: "https://github.com/RichardZhengQuan/NekoBar",
      description: {
        en: "Customizable bottom control bar for macOS with Touch Bar-style actions.",
        zh: "可自定义的 macOS 底部控制栏，提供类似 Touch Bar 的快捷操作。",
      },
    },
    {
      name: "usAIge",
      website: "https://pmrichq.com/project/usaige/",
      github: "https://github.com/RichardZhengQuan/usAIge",
      description: {
        en: "Always-on macOS HUD for Codex and ChatGPT usage limits.",
        zh: "常驻显示 Codex 和 ChatGPT 使用额度的 macOS 浮窗。",
      },
    },
    {
      name: "TradeLens",
      github: "https://github.com/RichardZhengQuan/Tradelensweb",
      description: {
        en: "Local dashboard for comparing FUTU holdings with target allocations.",
        zh: "用于对比 FUTU 实际持仓与目标配置的本地仪表盘。",
      },
    },
    {
      name: "Kechia",
      github: "https://github.com/RichardZhengQuan/kechia",
      description: {
        en: "macOS AI utility for translating and explaining selected text or screen captures.",
        zh: "用于翻译和解释所选文本或屏幕截图的 macOS AI 工具。",
      },
    },
    {
      name: "Iris English",
      github: "https://github.com/RichardZhengQuan/Iris-English",
      description: {
        en: "Adaptive English practice with learner profiles and guided sessions.",
        zh: "根据学习者画像提供引导式练习的自适应英语学习产品。",
      },
    },
    {
      name: "OneMind",
      github: "https://github.com/RichardZhengQuan/OneMind",
      description: {
        en: "Shared, versioned memory for keeping a team’s AI tools aligned.",
        zh: "让团队的多个 AI 工具保持一致的共享、可版本管理的记忆系统。",
      },
    },
    {
      name: "SwiftUI Native Design Skill",
      github: "https://github.com/RichardZhengQuan/swiftui-native-design-skill",
      description: {
        en: "Codex skill for designing and visually verifying native SwiftUI interfaces.",
        zh: "用于设计和视觉验证原生 SwiftUI 界面的 Codex 技能。",
      },
    },
    {
      name: "Personal Terminal Page",
      description: {
        en: "Terminal-style personal homepage with scripted command responses.",
        zh: "使用预设命令响应的终端风格个人主页。",
      },
    },
  ],
  contact: [
    {
      label: { en: "Email", zh: "邮箱" },
      value: "richard.zheng.pm@gmail.com",
      href: "mailto:richard.zheng.pm@gmail.com",
    },
    {
      label: { en: "GitHub", zh: "GitHub" },
      value: "github.com/RichardZhengQuan",
      href: "https://github.com/RichardZhengQuan",
    },
    {
      label: { en: "X", zh: "X" },
      value: "x.com/AllRichRich",
      href: "https://x.com/AllRichRich",
    },
  ],
} satisfies {
  name: string;
  title: LocalizedText;
  intro: Record<Language, string[]>;
  about: LocalizedText;
  now: LocalizedText;
  projects: Project[];
  contact: Array<{ label: LocalizedText; value: string; href: string }>;
};

export const copy = {
  en: {
    status: "RICHARD'S TERMINAL",
    languageLabel: "LANG: EN",
    languageCommand: "set system language CN",
    languageSwitchLabel: "Set terminal language to Chinese",
    pageTitle: "Richard's Terminal",
    pageDescription: "Richard's terminal-style personal homepage and project index.",
    introStatus: "BOOTING TERMINAL",
    introSkipLabel: "Skip startup sequence",
    inputLabel: "Terminal command",
    inputPlaceholder: "Enter a command...",
    promptTitle: "Quick commands",
    promptButtons: [
      { label: "Current focus", command: "/now" },
      { label: "Project index", command: "/projects" },
      { label: "About", command: "/about" },
      { label: "Contact", command: "/contact" },
    ],
    help: [
      "Commands:",
      "/help       List available commands.",
      "/about      Show profile.",
      "/projects   List projects.",
      "/now        Show current focus.",
      "/contact    Show contact details.",
      "/zh         Set language to Chinese.",
      "/en         Set language to English.",
      "/clear      Clear the terminal.",
    ],
    loading: {
      help: "Reading command index...",
      about: "Reading profile...",
      projects: "Reading project index...",
      now: "Reading current status...",
      contact: "Reading contact record...",
      language: "Applying language setting...",
      unknown: "Looking up command...",
    },
    foundProjects: (count: number) => `Loaded ${count} projects.`,
    projectLinks: {
      website: "Website",
      github: "GitHub",
      openWebsite: (project: string) => `Open ${project} website`,
      openGithub: (project: string) => `Open ${project} on GitHub`,
    },
    languageSwitched: "Language set to English.",
    unknown: "Command not found. Run /help to list available commands.",
  },
  zh: {
    status: "RICHARD 终端",
    languageLabel: "语言：中文",
    languageCommand: "set system language EN",
    languageSwitchLabel: "将终端语言设置为英文",
    pageTitle: "Richard 终端",
    pageDescription: "Richard 的终端风格个人主页与项目索引。",
    introStatus: "终端启动中",
    introSkipLabel: "跳过启动画面",
    inputLabel: "终端命令",
    inputPlaceholder: "输入命令...",
    promptTitle: "快捷命令",
    promptButtons: [
      { label: "当前动态", command: "/现在" },
      { label: "项目索引", command: "/项目" },
      { label: "关于", command: "/关于我" },
      { label: "联系方式", command: "/联系方式" },
    ],
    help: [
      "可用命令：",
      "/帮助       显示命令列表。",
      "/关于我     显示个人简介。",
      "/项目       列出项目。",
      "/现在       显示当前动态。",
      "/联系方式   显示联系方式。",
      "/zh         将语言设置为中文。",
      "/en         将语言设置为英文。",
      "/清空       清空终端。",
    ],
    loading: {
      help: "正在读取命令索引...",
      about: "正在读取个人资料...",
      projects: "正在读取项目索引...",
      now: "正在读取当前状态...",
      contact: "正在读取联系方式...",
      language: "正在应用语言设置...",
      unknown: "正在查找命令...",
    },
    foundProjects: (count: number) => `已加载 ${count} 个项目。`,
    projectLinks: {
      website: "网站",
      github: "GitHub",
      openWebsite: (project: string) => `打开 ${project} 网站`,
      openGithub: (project: string) => `在 GitHub 上打开 ${project}`,
    },
    languageSwitched: "语言已设置为中文。",
    unknown: "未找到该命令。输入 /帮助 查看可用命令。",
  },
} satisfies Record<
  Language,
  {
    status: string;
    languageLabel: string;
    languageCommand: string;
    languageSwitchLabel: string;
    pageTitle: string;
    pageDescription: string;
    introStatus: string;
    introSkipLabel: string;
    inputLabel: string;
    inputPlaceholder: string;
    promptTitle: string;
    promptButtons: Array<{ label: string; command: string }>;
    help: string[];
    loading: Record<CommandKey | "language" | "unknown", string>;
    foundProjects: (count: number) => string;
    projectLinks: {
      website: string;
      github: string;
      openWebsite: (project: string) => string;
      openGithub: (project: string) => string;
    };
    languageSwitched: string;
    unknown: string;
  }
>;

export const commandAliases: Record<string, CommandKey | "clear" | "en" | "zh"> = {
  "/help": "help",
  "/about": "about",
  "/projects": "projects",
  "/now": "now",
  "/contact": "contact",
  "/clear": "clear",
  "/en": "en",
  "/zh": "zh",
  "set system language en": "en",
  "set system language cn": "zh",
  "/帮助": "help",
  "/关于我": "about",
  "/项目": "projects",
  "/现在": "now",
  "/联系方式": "contact",
  "/清空": "clear",
};
