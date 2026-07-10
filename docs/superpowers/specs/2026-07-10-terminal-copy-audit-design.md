# Terminal Copy Audit Design

## Goal

Rewrite every user-visible English and Chinese string in a consistent friendly Unix-terminal voice.

## Voice

- Concise, direct, and operational.
- Human and readable without exaggerated hacker language.
- Prefer verbs such as `run`, `read`, `load`, `list`, and `set`.
- Avoid chatbot terms such as `prompts` and marketing terms such as `recovery-first` or `memory layer`.
- Keep English and Chinese natural rather than translating word for word.

## Scope

- Profile title, intro, about, current focus, and project descriptions.
- Quick-command heading and button labels.
- Help, loading, success, language, and unknown-command output.
- Localized contact labels.
- Startup status and skip accessibility label.
- Project-link accessibility labels.
- Page title, metadata description, and dynamic document language.

## Constraints

- Preserve all commands and aliases.
- Preserve the visible `set system language CN/EN` command behavior requested previously.
- Preserve project order, links, loading timing, layout, and terminal interactions.

## Verification

- Confirm old chatbot and marketing phrases no longer appear in source or rendered output.
- Verify English and Chinese intro, help, projects, current focus, contact, language switching, and unknown-command output.
- Verify localized startup and accessibility text.
- Run lint and production build, then inspect desktop and mobile layouts.

