# Project Portfolio Ranking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand and quality-rank Richard's bilingual terminal portfolio using verified project evidence.

**Architecture:** Keep portfolio records in the existing local data module and let the terminal renderer consume the same `Project[]` interface. Replace the static localized count strings with functions derived from the project array length, avoiding any new component or dependency.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Playwright browser verification

## Global Constraints

- No backend, API calls, or runtime AI.
- Keep all personal content in `src/data/personal.ts`.
- Preserve bilingual English and Chinese output.
- Preserve optional website and GitHub links opening in a new tab.

---

### Task 1: Expand And Rank Project Data

**Files:**
- Modify: `src/data/personal.ts`

**Interfaces:**
- Consumes: existing `Project` type with `name`, localized `description`, optional `website`, and optional `github`.
- Produces: `profile.projects: Project[]` containing ten records in the approved order.

- [ ] **Step 1: Run a failing browser assertion**

Open the production page, skip the intro, submit `/projects`, and assert the output contains `Found 10 projects.` and project names in the approved order.

- [ ] **Step 2: Verify the assertion fails**

Expected: FAIL because the current data contains three projects and renders `Found 3 projects.`.

- [ ] **Step 3: Add the ten approved bilingual project records**

Use the exact approved order from the design document. Include verified GitHub repository URLs and concise descriptions based on each README.

- [ ] **Step 4: Verify the project order in English and Chinese**

Expected: `/projects` and `/项目` each render all ten names in the same approved order.

### Task 2: Make Project Count Data-Driven

**Files:**
- Modify: `src/data/personal.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `profile.projects.length`.
- Produces: `copy[language].foundProjects(count: number): string`.

- [ ] **Step 1: Extend the failing assertion to require `Found 10 projects.` and `找到 10 个项目。`**

Expected: FAIL while `foundProjects` remains a static string.

- [ ] **Step 2: Change localized count copy to functions**

```ts
foundProjects: (count: number) => `Found ${count} projects.`,
foundProjects: (count: number) => `找到 ${count} 个项目。`,
```

- [ ] **Step 3: Pass `profile.projects.length` from the terminal command renderer**

```ts
lines.push(text.foundProjects(profile.projects.length));
```

- [ ] **Step 4: Run lint and production build**

Run: `pnpm lint && pnpm build`

Expected: both commands exit with status 0.

### Task 3: Browser Verification

**Files:**
- Verify: `src/data/personal.ts`
- Verify: `src/app/page.tsx`

**Interfaces:**
- Consumes: built Next.js page at `http://localhost:3000`.
- Produces: verified bilingual project output and new-tab links.

- [ ] **Step 1: Restart the production server if required**

Run: `pnpm start`

Expected: Next.js serves the production build on port 3000.

- [ ] **Step 2: Verify English output**

Expected: ten projects appear in the approved order and available link controls have `target="_blank"`.

- [ ] **Step 3: Verify Chinese output**

Expected: `找到 10 个项目。` appears and all ten Chinese descriptions render.

- [ ] **Step 4: Verify responsive layout**

Expected: project names, descriptions, and link controls remain visible without horizontal overflow on desktop and mobile viewports.

