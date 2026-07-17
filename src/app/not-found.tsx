import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Richard's Terminal",
  description: "The requested route is not available in Richard's Terminal.",
};

const rainColumns = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${2 + index * 3.85}%`,
  delay: `${-((index * 0.41) % 5.4)}s`,
  duration: `${4.8 + (index % 6) * 0.55}s`,
  opacity: 0.16 + (index % 4) * 0.035,
  bits: Array.from({ length: 28 + (index % 9) }, (_, bit) =>
    (index * 7 + bit * 3) % 5 < 2 ? "1" : "0",
  ).join("\n"),
}));

const diagnostics = [
  { label: "ROUTE LOOKUP", target: "/system/route", status: "[OK]" },
  { label: "DIRECTORY INDEX", target: "/var/www/content", status: "[OK]" },
  { label: "RECOVERY LINK", target: "/home", status: "[OK]" },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-terminal-bg font-mono text-[#d9fff0]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {rainColumns.map((column) => (
          <span
            key={column.id}
            className="not-found-rain-column absolute -top-24 whitespace-pre text-[13px] leading-[1.45] text-terminal-green"
            style={
              {
                left: column.left,
                opacity: column.opacity,
                animationDelay: column.delay,
                "--rain-duration": column.duration,
              } as CSSProperties
            }
          >
            {column.bits}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_39%_47%,rgba(2,4,3,0.98)_0%,rgba(2,4,3,0.92)_32%,rgba(2,4,3,0.28)_67%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(73,255,154,0.25)_1px,transparent_1px)] [background-size:100%_4px]" />

      <section className="relative z-10 flex min-h-screen w-full items-center px-5 py-16 sm:px-10 lg:px-0 lg:pl-[20vw]">
        <div className="w-full max-w-[720px] -translate-y-[4vh]">
          <div className="mb-9 space-y-4 text-[12px] leading-5 tracking-[0.035em] text-terminal-green/80 sm:text-[18px] sm:leading-6">
            {diagnostics.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3 sm:grid-cols-[170px_1fr_52px] sm:gap-5"
              >
                <span className="whitespace-nowrap">{row.label}</span>
                <span className="flex min-w-0 items-baseline gap-3">
                  <span className="min-w-0 flex-1 overflow-hidden text-terminal-green/45" aria-hidden="true">
                    ................................................................
                  </span>
                  <span className="hidden shrink-0 text-terminal-green/75 sm:inline">{row.target}</span>
                </span>
                <span className="text-right">{row.status}</span>
              </div>
            ))}
          </div>

          <div className="mb-7 max-w-[610px] border-b border-terminal-green/30 pb-6">
            <p className="text-[15px] font-semibold tracking-[0.06em] text-terminal-green [text-shadow:0_0_18px_rgba(73,255,154,0.38)] sm:text-[20px]">
              ERROR 404 — TARGET NOT FOUND
            </p>
          </div>

          <h1 className="mb-7 text-[clamp(1.25rem,2vw,1.9rem)] leading-tight tracking-[-0.02em] text-terminal-green/90">
            That page isn’t in this terminal.
          </h1>

          <div className="flex flex-col items-start gap-5">
            <Link
              href="/"
              className="inline-flex min-h-[68px] min-w-[300px] items-center rounded-[6px] border border-terminal-green/75 bg-terminal-green/[0.045] px-7 text-[clamp(1.2rem,2.1vw,1.9rem)] font-semibold text-terminal-green shadow-[0_0_0_1px_rgba(73,255,154,0.08),0_0_24px_rgba(73,255,154,0.12)] transition duration-200 hover:border-terminal-cyan hover:bg-terminal-cyan/10 hover:text-terminal-cyan focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:ring-offset-4 focus:ring-offset-terminal-bg active:translate-y-px sm:min-h-[80px] sm:min-w-[360px]"
            >
              <span aria-hidden="true">&gt;&nbsp;</span>
              open /home
            </Link>

            <a
              href="https://github.com/RichardZhengQuan"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center border-b border-terminal-cyan/60 text-[15px] text-terminal-cyan transition hover:border-terminal-green hover:text-terminal-green focus:outline-none focus:ring-2 focus:ring-terminal-cyan/70 focus:ring-offset-4 focus:ring-offset-terminal-bg sm:text-[19px]"
            >
              View projects <span className="ml-3" aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
