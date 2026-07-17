"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const TYPE_TICK_MS = 22;
const TYPE_CHARS_PER_TICK = 2;
const STEP_PAUSE_MS = 130;

const diagnostics = [
  { label: "ROUTE LOOKUP", target: "/system/route", status: "[OK]" },
  { label: "DIRECTORY INDEX", target: "/var/www/content", status: "[OK]" },
  { label: "RECOVERY LINK", target: "/home", status: "[OK]" },
];

const diagnosticLines = diagnostics.map(
  (row) => `${row.label.padEnd(18, " ")} ${".".repeat(20)} ${row.target}  ${row.status}`,
);
const errorText = "ERROR 404 — TARGET NOT FOUND";
const explanationText = "That page isn’t in this terminal.";
const homeCommand = "open /home";
const stepTexts = [
  ...diagnosticLines,
  errorText,
  explanationText,
  homeCommand,
];
const FINAL_STAGE = stepTexts.length;

function TerminalCursor() {
  return (
    <span className="ml-1 animate-pulse text-terminal-green" aria-hidden="true">
      ▋
    </span>
  );
}

export default function NotFoundClient() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [input, setInput] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComplete = stage >= FINAL_STAGE;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => setStage(FINAL_STAGE), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    if (isComplete) {
      return;
    }

    const currentText = stepTexts[stage];
    const stepComplete = visibleLength >= currentText.length;
    const timer = window.setTimeout(
      () => {
        if (stepComplete) {
          setStage((currentStage) => currentStage + 1);
          setVisibleLength(0);
          return;
        }

        setVisibleLength((currentLength) =>
          Math.min(currentLength + TYPE_CHARS_PER_TICK, currentText.length),
        );
      },
      stepComplete ? STEP_PAUSE_MS : TYPE_TICK_MS,
    );

    return () => window.clearTimeout(timer);
  }, [isComplete, stage, visibleLength]);

  const visibleForStep = useMemo(
    () => (stepIndex: number, text: string) => {
      if (stage > stepIndex || isComplete) {
        return text;
      }

      return stage === stepIndex ? text.slice(0, visibleLength) : "";
    },
    [isComplete, stage, visibleLength],
  );

  function cursorForStep(stepIndex: number) {
    return stage === stepIndex && !isComplete ? <TerminalCursor /> : null;
  }

  useEffect(() => {
    if (isComplete) {
      inputRef.current?.focus();
    }
  }, [isComplete]);

  function executeRecoveryCommand() {
    const command = input.trim().toLowerCase().replace(/\s+/g, " ");

    if (!command || !isComplete) {
      return;
    }

    if (["/home", "home", "open /home", "/"].includes(command)) {
      router.push("/");
      return;
    }

    if (["/back", "back", "cd .."].includes(command)) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
      return;
    }

    setInputFeedback(`Command not found: ${input.trim()}. Try /home or /back.`);
    setInput("");
  }

  function submitRecoveryCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeRecoveryCommand();
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
                RICHARD&apos;S TERMINAL
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-terminal-dim">
              <span>404 / ROUTE NOT FOUND</span>
            </div>
          </header>

          <div className="flex h-[min(72vh,680px)] min-h-[540px] flex-col sm:h-[min(76vh,720px)]">
            <div
              className="flex-1 overflow-y-auto px-4 py-5 text-sm leading-6 sm:px-6 sm:py-6 sm:text-[15px]"
              aria-busy={!isComplete}
              aria-live={isComplete ? "polite" : "off"}
            >
              <div className="mb-6 text-terminal-green">
                {diagnosticLines.map((line, index) => (
                  <p key={line} className="min-h-6 whitespace-pre-wrap">
                    {visibleForStep(index, line)}
                    {cursorForStep(index)}
                  </p>
                ))}
              </div>

              <div className="mb-6 text-[#d9fff0]">
                <p className="min-h-6 font-semibold text-terminal-green">
                  {visibleForStep(3, errorText)}
                  {cursorForStep(3)}
                </p>
                <p className="min-h-6 whitespace-pre-wrap">
                  {visibleForStep(4, explanationText)}
                  {cursorForStep(4)}
                </p>
              </div>
            </div>

            <div className="border-t border-terminal-line bg-black/30 px-4 py-4 sm:px-5">
              <div className="mb-3 text-xs uppercase tracking-[0.16em] text-terminal-dim">
                Recovery commands
              </div>
              <div className="grid min-h-10 grid-cols-1 gap-2">
                {stage >= 5 || isComplete ? (
                  stage > 5 || isComplete ? (
                    <Link
                      href="/"
                      className="min-h-10 rounded-[6px] border border-terminal-line bg-[#081916] px-3 py-2 text-left text-xs text-terminal-cyan transition hover:border-terminal-cyan hover:bg-terminal-cyan/10 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60 sm:text-[13px]"
                    >
                      {homeCommand}
                    </Link>
                  ) : (
                    <div className="min-h-10 rounded-[6px] border border-terminal-line bg-[#081916] px-3 py-2 text-left text-xs text-terminal-cyan sm:text-[13px]">
                      {visibleForStep(5, homeCommand)}
                      {cursorForStep(5)}
                    </div>
                  )
                ) : null}

              </div>

              {inputFeedback ? (
                <p className="mt-3 text-xs text-terminal-dim" role="status">
                  {inputFeedback}
                </p>
              ) : null}

              <form
                onSubmit={submitRecoveryCommand}
                className="mt-4 flex items-center gap-2 rounded-[6px] border border-terminal-line bg-[#020806] px-3 py-2 focus-within:border-terminal-green"
              >
                <label htmlFor="recovery-command" className="sr-only">
                  Recovery command
                </label>
                <span className="text-terminal-green" aria-hidden="true">
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  id="recovery-command"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setInputFeedback("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      executeRecoveryCommand();
                    }
                  }}
                  readOnly={!isComplete}
                  aria-disabled={!isComplete}
                  placeholder={isComplete ? "Enter /home or /back..." : "Recovery terminal starting..."}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#e7fff6] caret-terminal-green outline-none placeholder:text-terminal-dim sm:text-[15px]"
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
