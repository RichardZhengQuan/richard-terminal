# Richard's Terminal

A bilingual terminal-style personal homepage for Richard. It behaves like a small command console with scripted responses, project links, English and Chinese modes, and a skippable binary startup sequence.

The site is intentionally local and deterministic: it has no backend, AI model, API calls, analytics, or database.

## Commands

- `/help`
- `/about`
- `/projects`
- `/now`
- `/contact`
- `/zh`
- `/en`
- `/clear`

Chinese aliases are available for the content commands.

## Local development

Requirements:

- Node.js 22.13 or later
- pnpm 11 or later

Install and run:

```bash
pnpm install
pnpm dev
```

Build the Sites-compatible production bundle:

```bash
pnpm build
```

Build the static bundle used by the VPS deployment:

```bash
pnpm build:vps
```

The deployable files are written to `out/`.

## Editing personal content

All profile copy, projects, contact details, localized interface text, and command aliases live in [`src/data/personal.ts`](src/data/personal.ts).

## Technology

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vinext and Cloudflare Workers for Sites hosting
