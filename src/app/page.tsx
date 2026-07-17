"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  commandAliases,
  copy,
  type CommandKey,
  type Language,
  type Project,
  profile,
} from "@/data/personal";

type TerminalLine =
  | { id: number; type: "system"; lines: string[] }
  | { id: number; type: "command"; text: string }
  | { id: number; type: "loading"; text: string }
  | { id: number; type: "result"; lines: TerminalOutput[] };

type TerminalOutput =
  | string
  | { links: Array<{ label: string; ariaLabel: string; href: string }> }
  | { contact: { label: string; value: string; href: string } };

const LOADING_DURATION_MS = 420;
const LANGUAGE_STORAGE_KEY = "richard-terminal-language";

const BINARY_BITS_PER_COLUMN = 320;
const BINARY_COLUMN_COUNT = 56;

const binaryColumns = Array.from({ length: BINARY_COLUMN_COUNT }, (_, column) => {
  const trailLength = 7 + ((column * 5) % 12);
  const gapLength = 16 + ((column * 7) % 24);
  const cycleLength = trailLength + gapLength;
  const phase = (column * 17) % cycleLength;

  return {
    id: column,
    delay: `${-((column % 11) * 0.17)}s`,
    duration: `${2.2 + (column % 7) * 0.18}s`,
    bits: Array.from({ length: BINARY_BITS_PER_COLUMN }, (_, bit) => {
      const trailPosition = (bit + phase) % cycleLength;

      if (trailPosition >= trailLength) {
        return " ";
      }

      return (column + bit) % 3 === 0 ? "1" : "0";
    }).join(""),
  };
});

let lineId = 0;

function nextLineId() {
  lineId += 1;
  return lineId;
}

function createIntroLine(language: Language): TerminalLine {
  return {
    id: nextLineId(),
    type: "system",
    lines: profile.intro[language],
  };
}

function normalizeCommand(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function resolveCommand(value: string) {
  return commandAliases[normalizeCommand(value).toLowerCase()];
}

function commandLoadingText(command: CommandKey | "en" | "zh" | undefined, language: Language) {
  if (command === "en" || command === "zh") {
    return copy[language].loading.language;
  }

  if (!command) {
    return copy[language].loading.unknown;
  }

  return copy[language].loading[command];
}

function buildCommandResult(command: CommandKey | "en" | "zh" | undefined, language: Language) {
  if (command === "help") {
    return copy[language].help;
  }

  if (command === "about") {
    return [profile.about[language]];
  }

  if (command === "now") {
    return [profile.now[language]];
  }

  if (command === "projects") {
    return [
      copy[language].foundProjects(profile.projects.length),
      "",
      ...profile.projects.flatMap((project: Project, index): TerminalOutput[] => {
        const links = [
          ...(project.website
            ? [
                {
                  label: copy[language].projectLinks.website,
                  ariaLabel: copy[language].projectLinks.openWebsite(project.name),
                  href: project.website,
                },
              ]
            : []),
          ...(project.github
            ? [
                {
                  label: copy[language].projectLinks.github,
                  ariaLabel: copy[language].projectLinks.openGithub(project.name),
                  href: project.github,
                },
              ]
            : []),
        ];

        return [
          `[${index + 1}] ${project.name}`,
          `    ${project.description[language]}`,
          ...(links.length ? [{ links }] : []),
          "",
        ];
      }),
    ].slice(0, -1);
  }

  if (command === "contact") {
    return profile.contact.map((item) => ({
      contact: {
        label: item.label[language],
        value: item.value,
        href: item.href,
      },
    }));
  }

  if (command === "en" || command === "zh") {
    return [copy[command].languageSwitched];
  }

  return [copy[language].unknown];
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [lines, setLines] = useState<TerminalLine[]>(() => [createIntroLine("en")]);
  const [input, setInput] = useState("");
  const [introVisible, setIntroVisible] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const nextLanguage: Language = storedLanguage === "zh" ? "zh" : "en";

      setLanguage(nextLanguage);
      setLines([createIntroLine(nextLanguage)]);
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = copy[language].pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy[language].pageDescription);
  }, [isHydrated, language]);

  useEffect(() => {
    const skipIntro = () => setIntroVisible(false);

    window.addEventListener("pointerdown", skipIntro);
    window.addEventListener("keydown", skipIntro);

    return () => {
      window.removeEventListener("pointerdown", skipIntro);
      window.removeEventListener("keydown", skipIntro);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines]);

  useEffect(() => {
    if (!introVisible) {
      inputRef.current?.focus();
    }
  }, [introVisible]);

  const activeCopy = copy[language];

  const promptButtons = useMemo(() => activeCopy.promptButtons, [activeCopy]);

  function runCommand(rawCommand: string) {
    const commandText = normalizeCommand(rawCommand);

    if (!commandText || isLoading) {
      return;
    }

    const command = resolveCommand(commandText);

    if (command === "clear") {
      setLines([createIntroLine(language)]);
      setInput("");
      return;
    }

    const commandLanguage = command === "en" ? "en" : command === "zh" ? "zh" : language;
    const loadingLanguage = language;
    const loadingId = nextLineId();

    setInput("");
    setIsLoading(true);
    setLines((currentLines) => [
      ...currentLines,
      { id: nextLineId(), type: "command", text: commandText },
      { id: loadingId, type: "loading", text: commandLoadingText(command, loadingLanguage) },
    ]);

    window.setTimeout(() => {
      if (command === "en" || command === "zh") {
        setLanguage(command);
      }

      setLines((currentLines) => [
        ...currentLines.filter((line) => line.id !== loadingId),
        { id: nextLineId(), type: "result", lines: buildCommandResult(command, commandLanguage) },
      ]);
      setIsLoading(false);
    }, LOADING_DURATION_MS);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(input);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-terminal-bg px-4 py-6 font-mono text-[#d9fff0] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(55,231,255,0.12),transparent_32%),linear-gradient(180deg,rgba(2,4,3,0)_0%,rgba(2,4,3,0.96)_86%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(73,255,154,0.28)_1px,transparent_1px)] [background-size:100%_4px]" />

      <section className="relative z-10 flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-[8px] border border-terminal-line bg-terminal-shell/95 shadow-terminal backdrop-blur">
          <header className="flex flex-col gap-3 border-b border-terminal-line bg-black/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-terminal-green" aria-hidden="true" />
              <Image
                src="/logo.png"
                width={32}
                height={32}
                alt="Richard logo"
                priority
                unoptimized
                className="ml-1 rounded-[8px] ring-1 ring-terminal-green/30"
              />
              <span className="text-xs uppercase tracking-[0.18em] text-terminal-dim">
                {activeCopy.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-terminal-dim">
              <button
                type="button"
                onClick={() => runCommand(activeCopy.languageCommand)}
                disabled={isLoading}
                aria-label={activeCopy.languageSwitchLabel}
                className="rounded-[4px] border border-transparent px-1.5 py-1 transition hover:border-terminal-cyan hover:text-terminal-cyan focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {activeCopy.languageLabel}
              </button>
              <span className="hidden text-terminal-line sm:inline">|</span>
              <span>{profile.title[language]}</span>
            </div>
          </header>

          <div className="flex h-[min(72vh,680px)] min-h-[540px] flex-col sm:h-[min(76vh,720px)]">
            <div
              className="flex-1 overflow-y-auto px-4 py-5 text-sm leading-6 sm:px-6 sm:py-6 sm:text-[15px]"
              aria-live="polite"
            >
              {lines.map((line) => (
                <TerminalEntry key={line.id} line={line} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-terminal-line bg-black/30 px-4 py-4 sm:px-5">
              <div className="mb-3 text-xs uppercase tracking-[0.16em] text-terminal-dim">
                {activeCopy.promptTitle}
              </div>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {promptButtons.map((prompt) => (
                  <button
                    key={prompt.command}
                    type="button"
                    onClick={() => runCommand(prompt.command)}
                    disabled={isLoading}
                    className="min-h-10 rounded-[6px] border border-terminal-line bg-[#081916] px-3 py-2 text-left text-xs text-terminal-cyan transition hover:border-terminal-cyan hover:bg-terminal-cyan/10 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-[6px] border border-terminal-line bg-[#020806] px-3 py-2 focus-within:border-terminal-green">
                <label htmlFor="terminal-input" className="sr-only">
                  {activeCopy.inputLabel}
                </label>
                <span className="text-terminal-green" aria-hidden="true">
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  id="terminal-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isLoading}
                  placeholder={activeCopy.inputPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#e7fff6] caret-terminal-green outline-none placeholder:text-terminal-dim disabled:opacity-50 sm:text-[15px]"
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </div>
        </div>
      </section>

      {introVisible ? (
        <BinaryIntro
          status={activeCopy.introStatus}
          skipLabel={activeCopy.introSkipLabel}
          onSkip={() => setIntroVisible(false)}
        />
      ) : null}
    </main>
  );
}

function TerminalEntry({ line }: { line: TerminalLine }) {
  if (line.type === "command") {
    return (
      <div className="mb-4 text-terminal-cyan">
        <span className="text-terminal-green">&gt;</span> {line.text}
      </div>
    );
  }

  if (line.type === "loading") {
    return <div className="mb-4 animate-pulse text-terminal-dim">{line.text}</div>;
  }

  return (
    <div className={line.type === "system" ? "mb-6 text-terminal-green" : "mb-6 text-[#d9fff0]"}>
      {line.lines.map((output, index) => {
        if (typeof output !== "string") {
          if ("contact" in output) {
            const external = output.contact.href.startsWith("http");

            return (
              <p key={`${line.id}-${index}`}>
                {output.contact.label}: {" "}
                <a
                  href={output.contact.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="text-terminal-cyan underline decoration-terminal-line underline-offset-4 transition hover:decoration-terminal-cyan focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60"
                >
                  {output.contact.value}
                </a>
              </p>
            );
          }

          return (
            <div key={`${line.id}-${index}`} className="my-2 ml-4 flex flex-wrap gap-2">
              {output.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.ariaLabel}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-terminal-line bg-terminal-green/5 px-2.5 py-1 text-sm text-terminal-cyan transition hover:border-terminal-cyan hover:bg-terminal-cyan/10 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          );
        }

        return output ? (
          <p key={`${line.id}-${index}`} className="whitespace-pre-wrap">
            {output}
          </p>
        ) : (
          <div key={`${line.id}-${index}`} className="h-3" />
        );
      })}
    </div>
  );
}

function BinaryIntro({
  status,
  skipLabel,
  onSkip,
}: {
  status: string;
  skipLabel: string;
  onSkip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSkip}
      onKeyDown={onSkip}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden bg-black text-terminal-green focus:outline-none"
      aria-label={skipLabel}
      autoFocus
    >
      <div className="absolute inset-0 flex justify-around opacity-80" aria-hidden="true">
        {binaryColumns.map((column) => (
          <span
            key={column.id}
            className="binary-rain-column animate-[binary-fall_var(--duration)_linear_infinite] whitespace-pre text-left text-[clamp(13px,0.9vw,18px)] leading-[1.15] text-terminal-green/70 [text-shadow:0_0_14px_rgba(73,255,154,0.85)]"
            style={
              {
                "--duration": column.duration,
                animationDelay: column.delay,
              } as React.CSSProperties
            }
          >
            {column.bits.split("").join("\n")}
          </span>
        ))}
      </div>
      <div className="relative z-10 border border-terminal-green/40 bg-black/75 px-5 py-3 text-sm uppercase tracking-[0.24em] text-terminal-cyan shadow-terminal">
        {status}
      </div>
    </button>
  );
}
