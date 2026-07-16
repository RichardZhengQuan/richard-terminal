# Terminal Language Toggle Design

## Scope

Make the language status in the terminal header an interactive, bidirectional control. Also rename the terminal status from "Public Terminal" to "Richard's Terminal" in both languages.

## Behavior

- In English, the header shows `LANG: EN`. Clicking it submits `set system language CN` through the existing terminal command pipeline.
- In Chinese, the header shows `语言：中文`. Clicking it submits `set system language EN` through the same pipeline.
- The submitted text appears as a normal terminal command, followed by the existing localized loading message and localized confirmation.
- The interface switches language after the loading delay and persists the new language in localStorage.
- The language control is disabled while another command is loading and remains keyboard accessible.
- Typing `set system language CN` or `set system language EN` into the terminal performs the same switch.

## Content

- English terminal status: `RICHARD'S TERMINAL`
- Chinese terminal status: `RICHARD 的终端`

All user-facing strings and command aliases remain in `src/data/personal.ts`.

## Implementation

Add the two natural-language commands to the existing command alias table. Replace the static language label with a button that submits the command for the opposite language through `runCommand`. Keep the current `/zh` and `/en` commands unchanged.

## Verification

- Confirm the language label is keyboard-focusable and disabled during loading.
- Click English to Chinese and verify the command line, loading state, localized result, and Chinese interface.
- Click Chinese to English and verify the reverse flow.
- Reload and verify the selected language persists.
- Run lint and the production build.
