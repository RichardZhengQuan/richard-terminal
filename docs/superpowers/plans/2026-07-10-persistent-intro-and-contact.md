# Persistent Intro And Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Matrix intro visible until deliberate input and replace all placeholder contact details with Richard's supplied profiles.

**Architecture:** Remove only the intro timeout while preserving the existing pointer and keyboard dismissal listeners. Keep contact values and link targets in the existing local `profile.contact` data structure.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, browser automation, ESLint

## Global Constraints

- The intro dismisses on click, tap, or any keyboard key.
- The intro appears again after every reload and has no persisted seen state.
- Reduced-motion behavior remains static and dismissible.
- No backend, API calls, AI, or new runtime dependencies.
- Contact content remains in `src/data/personal.ts`.

---

### Task 1: Persistent Matrix Intro

**Files:**
- Modify: `src/app/page.tsx`
- Test: browser behavior at `http://localhost:3001/`

**Interfaces:**
- Consumes: `introVisible`, `setIntroVisible`, and the existing `pointerdown` and `keydown` listeners.
- Produces: an intro that has no automatic timeout and dismisses only through user input.

- [ ] **Step 1: Run the failing persistence assertion**

Open the page, wait at least 2,100 milliseconds without interaction, and assert the `Skip intro` button is still visible.

Expected before implementation: FAIL because `INTRO_DURATION_MS` dismisses the intro after 1,500 milliseconds.

- [ ] **Step 2: Remove automatic dismissal**

Delete this constant from `src/app/page.tsx`:

```ts
const INTRO_DURATION_MS = 1500;
```

Replace the intro effect with:

```ts
useEffect(() => {
  const skipIntro = () => setIntroVisible(false);

  window.addEventListener("pointerdown", skipIntro);
  window.addEventListener("keydown", skipIntro);

  return () => {
    window.removeEventListener("pointerdown", skipIntro);
    window.removeEventListener("keydown", skipIntro);
  };
}, []);
```

- [ ] **Step 3: Verify persistence and both dismissal paths**

Confirm the intro remains after 2,100 milliseconds. Press any key and confirm the intro disappears and the terminal input gains focus. Reload, confirm the intro reappears, click it, and confirm it disappears.

### Task 2: Real Contact Details

**Files:**
- Modify: `src/data/personal.ts`
- Test: `/contact` terminal output at `http://localhost:3001/`

**Interfaces:**
- Consumes: `profile.contact` and the existing `buildCommandResult("contact", language)` mapping.
- Produces: Richard's supplied email, GitHub, and X values with valid link targets.

- [ ] **Step 1: Run the failing contact assertion**

Submit `/contact` and assert the terminal contains `richard.zheng.pm@gmail.com`, `github.com/RichardZhengQuan`, and `x.com/AllRichRich`.

Expected before implementation: FAIL because the current data still contains `hello@example.com`, `github.com/example`, and `x.com/example`.

- [ ] **Step 2: Replace the contact data**

Set `profile.contact` in `src/data/personal.ts` to:

```ts
contact: [
  {
    label: "Email",
    value: "richard.zheng.pm@gmail.com",
    href: "mailto:richard.zheng.pm@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/RichardZhengQuan",
    href: "https://github.com/RichardZhengQuan",
  },
  {
    label: "X",
    value: "x.com/AllRichRich",
    href: "https://x.com/AllRichRich",
  },
],
```

- [ ] **Step 3: Verify contact output**

Submit `/contact` and confirm all three supplied values appear without the old placeholders.

### Task 3: Static And Production Verification

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `src/data/personal.ts`

**Interfaces:**
- Consumes: the completed intro and contact changes.
- Produces: a lint-clean, type-safe, statically prerendered production build.

- [ ] **Step 1: Run static checks**

```bash
pnpm lint
pnpm build
```

Expected: both commands exit with code 0 and Next.js reports `/` as statically prerendered.

- [ ] **Step 2: Restart and verify production**

Restart `next start` on port 3000, confirm `curl http://localhost:3000` returns HTTP 200, and verify the persistent intro and contact output against the production build.

- [ ] **Step 3: Commit when Git is available**

This workspace is not currently a Git repository. If Git is initialized later:

```bash
git add src/app/page.tsx src/data/personal.ts docs/superpowers/specs/2026-07-10-persistent-intro-design.md docs/superpowers/plans/2026-07-10-persistent-intro-and-contact.md
git commit -m "feat: persist intro and update contact details"
```
