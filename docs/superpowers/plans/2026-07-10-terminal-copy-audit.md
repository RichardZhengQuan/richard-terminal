# Terminal Copy Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Richard's bilingual personal terminal one natural, consistent friendly Unix-terminal voice.

**Architecture:** Keep localized content in `src/data/personal.ts`, extend existing localized types only where contact and accessibility copy require it, and consume those values in `src/app/page.tsx`. Keep metadata copy in the existing layout module.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, browser verification

## Global Constraints

- No backend, API calls, or runtime AI.
- Preserve every command and alias.
- Preserve the existing project order and destinations.
- Preserve `set system language CN/EN` as the visible language-switch command.

---

### Task 1: Rewrite Localized Content

**Files:**
- Modify: `src/data/personal.ts`

- [ ] Run a browser assertion that requires `Quick commands`, `Public terminal ready.`, and `Loaded 10 projects.` and confirm it fails against the current copy.
- [ ] Rewrite English and Chinese profile, project, prompt, help, loading, success, and error strings.
- [ ] Localize contact labels with `Record<Language, string>`.
- [ ] Add localized startup and project-link accessibility copy.

### Task 2: Consume Localized Interface Copy

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] Render contact labels using the active language.
- [ ] Give project links localized descriptive accessibility labels.
- [ ] Render localized startup status and skip label.
- [ ] Keep the root document `lang` attribute synchronized with the active language.
- [ ] Rewrite page metadata in the same voice.

### Task 3: Verify Every Text Path

**Files:**
- Verify: `src/data/personal.ts`
- Verify: `src/app/page.tsx`
- Verify: `src/app/layout.tsx`

- [ ] Search source for removed phrases including `Suggested prompts`, `提示词`, `Opening contact channel`, `fake-AI`, `recovery-first`, and `local-first`.
- [ ] Run `pnpm lint && pnpm build` and require exit status 0.
- [ ] Verify both languages across intro, help, projects, now, contact, language switching, and unknown command.
- [ ] Verify no horizontal overflow or console issues at 390px and 1280px.

