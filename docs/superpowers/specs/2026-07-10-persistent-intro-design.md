# Persistent Intro Design

## Scope

Keep the Matrix-style binary intro visible until the visitor intentionally enters the terminal.
Replace the placeholder contact details with Richard's supplied email and social profiles.

## Behavior

- Remove the automatic 1.5-second dismissal timer.
- Keep the binary animation running for as long as the intro is visible.
- Dismiss the intro immediately on click, tap, or any keyboard key.
- Show the intro again on every page load or reload; do not store a seen state.
- Preserve the existing focus handoff to the terminal input after dismissal.
- Under reduced-motion preferences, keep the intro static and dismissible through the same inputs.

## Implementation

Remove `INTRO_DURATION_MS` and the timeout from the intro effect in `src/app/page.tsx`. Keep the existing pointer and keyboard listeners and their cleanup.

Update `profile.contact` in `src/data/personal.ts` with:

- Email: `richard.zheng.pm@gmail.com`
- GitHub: `github.com/RichardZhengQuan`
- X: `x.com/AllRichRich`

Use `mailto:richard.zheng.pm@gmail.com`, `https://github.com/RichardZhengQuan`, and `https://x.com/AllRichRich` as the corresponding links.

## Verification

- Confirm the intro remains visible for more than two seconds without interaction.
- Confirm any keyboard key dismisses it and focuses the terminal input.
- Reload and confirm click or tap dismisses it.
- Confirm `/contact` shows the supplied email, GitHub, and X values.
- Run lint and the production build.
