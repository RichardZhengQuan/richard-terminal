"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import TerminalRain from "./terminal-rain";
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
  | { id: number; type: "result"; lines: TerminalOutput[]; isStreaming?: boolean };

type TerminalOutput =
  | string
  | {
      links: Array<{ label: string; ariaLabel: string; href: string }>;
      visibleLabels?: string[];
    }
  | {
      contact: { label: string; value: string; href: string };
      visibleLength?: number;
    };

const LOADING_DURATION_MS = 420;
const COMMAND_KEYSTROKE_MS = 58;
const OUTPUT_TICK_MS = 16;
const OUTPUT_CHARS_PER_TICK = 2;
const OUTPUT_LINE_PAUSE_MS = 72;
const INTRO_DURATION_MS = 3000;
const LANGUAGE_STORAGE_KEY = "richard-terminal-language";

let lineId = 0;

function nextLineId() {
  lineId += 1;
  return lineId;
}

function createIntroLine(language: Language): TerminalLine {
  return {
    id: 0,
    type: "system",
    lines: profile.intro[language],
  };
}

function normalizeCommand(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

function shouldAnimateTerminal() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function updateResultLine(
  lines: TerminalLine[],
  resultId: number,
  update: (visibleLines: TerminalOutput[]) => TerminalOutput[],
) {
  return lines.map((line) =>
    line.id === resultId && line.type === "result"
      ? { ...line, lines: update(line.lines) }
      : line,
  );
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
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingScrollLineIdRef = useRef<number | null>(null);
  const activeRunRef = useRef(0);
  const isBusyRef = useRef(false);
  const dismissIntro = useCallback(() => setIntroVisible(false), []);

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
    const pendingScrollLineId = pendingScrollLineIdRef.current;

    if (pendingScrollLineId !== null) {
      const viewport = scrollViewportRef.current;
      const target = viewport?.querySelector<HTMLElement>(
        `[data-terminal-line-id="${pendingScrollLineId}"]`,
      );

      if (viewport && target) {
        const viewportRect = viewport.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        viewport.scrollTo({
          top: viewport.scrollTop + targetRect.top - viewportRect.top - 20,
          behavior: "smooth",
        });
        pendingScrollLineIdRef.current = null;
        return;
      }
    }

    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines]);

  useEffect(() => {
    if (!introVisible) {
      inputRef.current?.focus();
    }
  }, [introVisible]);

  useEffect(() => {
    return () => {
      activeRunRef.current += 1;
    };
  }, []);

  const activeCopy = copy[language];

  const promptButtons = useMemo(() => activeCopy.promptButtons, [activeCopy]);

  async function runCommand(rawCommand: string, typeCommand = false) {
    const commandText = normalizeCommand(rawCommand);

    if (!commandText || isBusyRef.current) {
      return;
    }

    const command = resolveCommand(commandText);

    if (command === "clear") {
      setLines([createIntroLine(language)]);
      setInput("");
      return;
    }

    const runId = activeRunRef.current + 1;
    activeRunRef.current = runId;
    isBusyRef.current = true;
    setIsLoading(true);

    const animate = shouldAnimateTerminal();

    if (typeCommand && animate) {
      setInput("");

      for (let index = 1; index <= commandText.length; index += 1) {
        if (activeRunRef.current !== runId) {
          return;
        }

        setInput(commandText.slice(0, index));
        await wait(COMMAND_KEYSTROKE_MS);
      }

      await wait(110);
    }

    const commandLanguage = command === "en" ? "en" : command === "zh" ? "zh" : language;
    const loadingLanguage = language;
    const commandLineId = nextLineId();
    const loadingId = nextLineId();

    setInput("");
    setLines((currentLines) => [
      ...currentLines,
      { id: commandLineId, type: "command", text: commandText },
      { id: loadingId, type: "loading", text: commandLoadingText(command, loadingLanguage) },
    ]);

    await wait(animate ? LOADING_DURATION_MS : 0);

    if (activeRunRef.current !== runId) {
      return;
    }

    if (command === "en" || command === "zh") {
      setLanguage(command);
    }

    if (command === "projects") {
      pendingScrollLineIdRef.current = commandLineId;
    }

    const resultId = nextLineId();
    const result = buildCommandResult(command, commandLanguage);

    if (!animate) {
      setLines((currentLines) => [
        ...currentLines.filter((line) => line.id !== loadingId),
        { id: resultId, type: "result", lines: result },
      ]);
    } else {
      setLines((currentLines) => [
        ...currentLines.filter((line) => line.id !== loadingId),
        { id: resultId, type: "result", lines: [], isStreaming: true },
      ]);

      for (const output of result) {
        if (activeRunRef.current !== runId) {
          return;
        }

        if (typeof output === "string") {
          setLines((currentLines) =>
            updateResultLine(currentLines, resultId, (visibleLines) => [...visibleLines, ""]),
          );

          for (
            let length = OUTPUT_CHARS_PER_TICK;
            length <= output.length + OUTPUT_CHARS_PER_TICK;
            length += OUTPUT_CHARS_PER_TICK
          ) {
            if (activeRunRef.current !== runId) {
              return;
            }

            const visibleText = output.slice(0, length);
            setLines((currentLines) =>
              updateResultLine(currentLines, resultId, (visibleLines) => [
                ...visibleLines.slice(0, -1),
                visibleText,
              ]),
            );

            if (visibleText.length === output.length) {
              break;
            }

            await wait(OUTPUT_TICK_MS);
          }
        } else if ("contact" in output) {
          const completeText = `${output.contact.label}: ${output.contact.value}`;

          setLines((currentLines) =>
            updateResultLine(currentLines, resultId, (visibleLines) => [
              ...visibleLines,
              { ...output, visibleLength: 0 },
            ]),
          );

          for (
            let length = OUTPUT_CHARS_PER_TICK;
            length <= completeText.length + OUTPUT_CHARS_PER_TICK;
            length += OUTPUT_CHARS_PER_TICK
          ) {
            if (activeRunRef.current !== runId) {
              return;
            }

            const visibleLength = Math.min(length, completeText.length);
            setLines((currentLines) =>
              updateResultLine(currentLines, resultId, (visibleLines) => [
                ...visibleLines.slice(0, -1),
                { ...output, visibleLength },
              ]),
            );

            if (visibleLength === completeText.length) {
              break;
            }

            await wait(OUTPUT_TICK_MS);
          }
        } else {
          let visibleLabels: string[] = [];

          setLines((currentLines) =>
            updateResultLine(currentLines, resultId, (visibleLines) => [
              ...visibleLines,
              { ...output, visibleLabels },
            ]),
          );

          for (const link of output.links) {
            const completedLabels = visibleLabels;

            for (
              let length = OUTPUT_CHARS_PER_TICK;
              length <= link.label.length + OUTPUT_CHARS_PER_TICK;
              length += OUTPUT_CHARS_PER_TICK
            ) {
              if (activeRunRef.current !== runId) {
                return;
              }

              const visibleLabel = link.label.slice(0, length);
              const nextVisibleLabels = [...completedLabels, visibleLabel];

              setLines((currentLines) =>
                updateResultLine(currentLines, resultId, (visibleLines) => [
                  ...visibleLines.slice(0, -1),
                  { ...output, visibleLabels: nextVisibleLabels },
                ]),
              );

              if (visibleLabel.length === link.label.length) {
                visibleLabels = nextVisibleLabels;
                break;
              }

              await wait(OUTPUT_TICK_MS);
            }

            await wait(OUTPUT_LINE_PAUSE_MS);
          }
        }

        await wait(OUTPUT_LINE_PAUSE_MS);
      }

      setLines((currentLines) =>
        currentLines.map((line) =>
          line.id === resultId && line.type === "result"
            ? { ...line, isStreaming: false }
            : line,
        ),
      );
    }

    isBusyRef.current = false;
    setIsLoading(false);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(input);
  }

  return (
    <main className="app-viewport relative overflow-hidden bg-terminal-bg px-4 py-6 font-mono text-[#d9fff0] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(55,231,255,0.12),transparent_32%),linear-gradient(180deg,rgba(2,4,3,0)_0%,rgba(2,4,3,0.96)_86%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(73,255,154,0.28)_1px,transparent_1px)] [background-size:100%_4px]" />

      <section className="app-viewport-content relative z-10 flex items-center justify-center">
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
                onClick={() => runCommand(activeCopy.languageCommand, true)}
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
              ref={scrollViewportRef}
              className="flex-1 overflow-y-auto px-4 py-5 text-sm leading-6 sm:px-6 sm:py-6 sm:text-[15px]"
              aria-live={isLoading ? "off" : "polite"}
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
                    onClick={() => runCommand(prompt.command, true)}
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
                  readOnly={isLoading}
                  aria-disabled={isLoading}
                  placeholder={activeCopy.inputPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#e7fff6] caret-terminal-green outline-none placeholder:text-terminal-dim sm:text-[15px]"
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
          onSkip={dismissIntro}
        />
      ) : null}
    </main>
  );
}

function TerminalEntry({ line }: { line: TerminalLine }) {
  if (line.type === "command") {
    return (
      <div data-terminal-line-id={line.id} className="mb-4 text-terminal-cyan">
        <span className="text-terminal-green">&gt;</span> {line.text}
      </div>
    );
  }

  if (line.type === "loading") {
    return (
      <div data-terminal-line-id={line.id} className="mb-4 animate-pulse text-terminal-dim">
        {line.text}
      </div>
    );
  }

  return (
    <div
      data-terminal-line-id={line.id}
      className={line.type === "system" ? "mb-6 text-terminal-green" : "mb-6 text-[#d9fff0]"}
    >
      {line.lines.map((output, index) => {
        if (typeof output !== "string") {
          if ("contact" in output) {
            const external = output.contact.href.startsWith("http");
            const label = `${output.contact.label}: `;
            const completeLength = label.length + output.contact.value.length;
            const visibleLength = output.visibleLength ?? completeLength;
            const visibleLabel = label.slice(0, visibleLength);
            const visibleValue = output.contact.value.slice(
              0,
              Math.max(0, visibleLength - label.length),
            );

            return (
              <p key={`${line.id}-${index}`}>
                {visibleLabel}
                {visibleValue ? (
                  <a
                    href={output.contact.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="text-terminal-cyan underline decoration-terminal-line underline-offset-4 transition hover:decoration-terminal-cyan focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60"
                  >
                    {visibleValue}
                  </a>
                ) : null}
              </p>
            );
          }

          const visibleLabels =
            output.visibleLabels ?? output.links.map((link) => link.label);

          return (
            <div key={`${line.id}-${index}`} className="my-2 ml-4 flex flex-wrap gap-2">
              {visibleLabels.map((visibleLabel, linkIndex) => {
                const link = output.links[linkIndex];

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.ariaLabel}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-terminal-line bg-terminal-green/5 px-2.5 py-1 text-sm text-terminal-cyan transition hover:border-terminal-cyan hover:bg-terminal-cyan/10 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60"
                  >
                    {visibleLabel}
                    {visibleLabel.length === link.label.length ? (
                      <span aria-hidden="true">↗</span>
                    ) : null}
                  </a>
                );
              })}
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
      {line.type === "result" && line.isStreaming ? (
        <span className="animate-pulse text-terminal-green" aria-hidden="true">
          ▋
        </span>
      ) : null}
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
  useEffect(() => {
    const autoDismissTimer = window.setTimeout(onSkip, INTRO_DURATION_MS);
    return () => window.clearTimeout(autoDismissTimer);
  }, [onSkip]);

  return (
    <button
      type="button"
      onClick={onSkip}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Enter") {
          event.preventDefault();
          onSkip();
          return;
        }

        if (event.key === " ") {
          event.preventDefault();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === " ") {
          event.preventDefault();
        }
      }}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden bg-black text-terminal-green focus:outline-none"
      aria-label={skipLabel}
      autoFocus
    >
      <TerminalRain />
      <div className="relative z-10 border border-terminal-green/40 bg-black/75 px-5 py-3 text-sm uppercase tracking-[0.24em] text-terminal-cyan shadow-terminal">
        {status}
      </div>
    </button>
  );
}
