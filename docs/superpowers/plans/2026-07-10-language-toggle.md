# Terminal Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the terminal header language label submit a visible bidirectional language command and rename the terminal status for Richard.

**Architecture:** Keep the existing `runCommand` pipeline as the single path for typed commands, prompt actions, and the new header control. Store the natural-language command text, accessible labels, localized status, and aliases in the existing local content file.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, browser automation, ESLint

## Global Constraints

- No backend, AI, API calls, or new runtime dependencies.
- All user-facing content remains in `src/data/personal.ts`.
- Keep `/zh` and `/en` working alongside the new natural-language commands.
- English terminal status is `RICHARD'S TERMINAL`; Chinese terminal status is `RICHARD 的终端`.

---

### Task 1: Interactive Language Command

**Files:**
- Modify: `src/data/personal.ts`
- Modify: `src/app/page.tsx`
- Test: browser behavior at `http://localhost:3000/`

**Interfaces:**
- Consumes: `runCommand(rawCommand: string)`, `copy: Record<Language, LocalizedCopy>`, and `commandAliases`.
- Produces: `copy[language].languageCommand`, `copy[language].languageSwitchLabel`, and aliases resolving `set system language cn|en` to `zh|en`.

- [ ] **Step 1: Run the failing browser assertion**

Inspect the header element whose text is `LANG: EN` and assert it is a button. Click it and assert the terminal eventually contains `set system language CN` and switches to `语言：中文`.

Expected before implementation: FAIL because the language label is a `SPAN` and has no click behavior.

- [ ] **Step 2: Add localized content and command aliases**

In `src/data/personal.ts`, update and add these English fields:

```ts
status: "RICHARD'S TERMINAL",
languageLabel: "LANG: EN",
languageCommand: "set system language CN",
languageSwitchLabel: "Switch interface language to Chinese",
```

Add the Chinese equivalents:

```ts
status: "RICHARD 的终端",
languageLabel: "语言：中文",
languageCommand: "set system language EN",
languageSwitchLabel: "切换界面语言到英文",
```

Extend the `copy` constraint with:

```ts
languageCommand: string;
languageSwitchLabel: string;
```

Add these aliases:

```ts
"set system language cn": "zh",
"set system language en": "en",
```

- [ ] **Step 3: Replace the static language label with a command button**

In `src/app/page.tsx`, replace the current language-label `span` with:

```tsx
<button
  type="button"
  onClick={() => runCommand(activeCopy.languageCommand)}
  disabled={isLoading}
  aria-label={activeCopy.languageSwitchLabel}
  className="rounded-[4px] border border-transparent px-1.5 py-1 transition hover:border-terminal-cyan hover:text-terminal-cyan focus:outline-none focus:ring-2 focus:ring-terminal-cyan/60 disabled:cursor-not-allowed disabled:opacity-50"
>
  {activeCopy.languageLabel}
</button>
```

- [ ] **Step 4: Run the browser assertion to verify both directions**

Verify English to Chinese:

```text
> set system language CN
正在更新语言偏好...
已切换到中文。
```

Then click the Chinese control and verify:

```text
> set system language EN
Updating language preference...
Language switched to English.
```

Reload after each direction and confirm the selected language persists. Confirm the header status reads `RICHARD'S TERMINAL` in English and `RICHARD 的终端` in Chinese.

- [ ] **Step 5: Run static verification**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit with code 0; Next.js reports `/` as statically prerendered.

- [ ] **Step 6: Commit when Git is available**

This workspace is not currently a Git repository. If Git is initialized later, commit the content, component, spec, and plan together:

```bash
git add src/data/personal.ts src/app/page.tsx docs/superpowers/specs/2026-07-10-language-toggle-design.md docs/superpowers/plans/2026-07-10-language-toggle.md
git commit -m "feat: add terminal language toggle"
```
