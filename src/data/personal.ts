export type Language = "en" | "zh";

type LocalizedText = Record<Language, string>;

export type Project = {
  name: string;
  description: LocalizedText;
  website?: string;
  github?: string;
};

export const profile = {
  name: "Richard Q",
  localizedName: { en: "Richard Q", zh: "郑荃" },
  title: {
    en: "Product manager building practical AI tools and product systems.",
    zh: "产品经理，专注于 AI 工具和产品系统。",
  },
  intro: {
    en: ["Hello. I’m Richard Q.", "Public terminal ready.", "Run /help or select a command below."],
    zh: ["你好，我是郑荃。", "公开终端已就绪。", "输入 /帮助，或选择下方命令。"],
  },
  about: {
    en: "I’m Richard Q, a product manager focused on AI tools, agent systems, product design, and practical software.",
    zh: "我是郑荃，一名产品经理，专注于 AI 工具、Agent 系统、产品设计和实用软件。",
  },
  now: {
    en: "Current focus: refining practical AI tools, native macOS and iOS apps, and this public terminal.",
    zh: "当前重点：持续打磨实用 AI 工具、macOS 与 iOS 原生应用，以及这个公开终端。",
  },
  projects: [
    {
      name: "OneMind",
      website: "https://onemind.team/",
      description: {
        en: "A team AI memory and governance layer that turns shared knowledge into reviewed, versioned context and keeps it synchronized across Codex, Claude Code, Cursor, OpenClaw, and other tools.",
        zh: "面向团队的 AI 记忆与治理层，将共享知识整理为经过审核、可版本管理的上下文，并持续同步到 Codex、Claude Code、Cursor、OpenClaw 等工具。",
      },
    },
    {
      name: "NEO",
      website: "https://pmrichq.com/project/neo/",
      github: "https://github.com/RichardZhengQuan/NEO",
      description: {
        en: "An open-source personal AI that grows with you: one continuous timeline, associative memory, and a personality learned through conversation. Choose its AI and run it on your device or your own server.",
        zh: "一个与你共同成长的开源个人 AI：连续的时间线、联想记忆，以及通过对话逐渐形成的个性。AI 由你选择，运行在你的设备或自己的服务器上。",
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
      name: "Clip Loop",
      website: "https://pmrichq.com/project/cliploop/",
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
      name: "SwiftUI Native Design Skill",
      github: "https://github.com/RichardZhengQuan/swiftui-native-design-skill",
      description: {
        en: "Codex skill for designing and visually verifying native SwiftUI interfaces.",
        zh: "用于设计和视觉验证原生 SwiftUI 界面的 Codex 技能。",
      },
    },
    {
      name: "AI Interaction Design Guidelines",
      website: "https://pmrichq.com/project/ai-interaction-design-guidelines/",
      github: "https://github.com/RichardZhengQuan/ai-interaction-design-guidelines",
      description: {
        en: "A bilingual guide to designing personal AI assistants that say less, show more, and keep people in control—with seven principles, interactive examples, and guidance for six device contexts.",
        zh: "一份面向个人 AI 助手的中英文交互设计指南，通过七条原则、交互示例和六类设备的应用说明，让助手少说一点、多展示一点，并把控制权留给用户。",
      },
    },
    {
      name: "TradeLens",
      description: {
        en: "Local dashboard for comparing FUTU holdings with target allocations.",
        zh: "用于对比 FUTU 实际持仓与目标配置的本地仪表盘。",
      },
    },
    {
      name: "Kechia",
      description: {
        en: "macOS AI utility for translating and explaining selected text or screen captures.",
        zh: "用于翻译和解释所选文本或屏幕截图的 macOS AI 工具。",
      },
    },
    {
      name: "Iris English",
      description: {
        en: "Adaptive English practice with learner profiles and guided sessions.",
        zh: "根据学习者画像提供引导式练习的自适应英语学习产品。",
      },
    },
    {
      name: "A Little Theatre",
      description: {
        en: "A bilingual personal showcase with page-by-page project transitions. The portfolio you’re exploring right now.",
        zh: "一个双语个人作品集，以逐页翻动的方式展示项目。就是你现在正在浏览的这个网站。",
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
    {
      label: { en: "Vibeloft", zh: "Vibeloft" },
      value: "vibeloft.ai/profile/richquan",
      href: "https://vibeloft.ai/profile/richquan",
    },
  ],
} satisfies {
  name: string;
  localizedName: LocalizedText;
  title: LocalizedText;
  intro: Record<Language, string[]>;
  about: LocalizedText;
  now: LocalizedText;
  projects: Project[];
  contact: Array<{ label: LocalizedText; value: string; href: string }>;
};
