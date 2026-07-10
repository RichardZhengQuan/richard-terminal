# Project Portfolio Ranking Design

## Goal

Expand the terminal portfolio from three to ten bilingual project entries and order them by demonstrated product quality rather than repository recency.

## Ranking Criteria

Rank products using evidence from GitHub and local documentation, in this order of importance:

1. Published releases and installable artifacts.
2. Implemented product scope and platform coverage.
3. Automated test coverage and documented verification.
4. Public accessibility and repository documentation.
5. Product maturity relative to planned or experimental work.

## Approved Order

1. Clip Loop
2. ClawNest
3. NekoBar
4. usAIge
5. TradeLens
6. Kechia
7. Iris English
8. OneMind
9. SwiftUI Native Design Skill
10. Personal Terminal Page

## Data And Presentation

- Keep all content in `src/data/personal.ts`.
- Provide concise English and Chinese descriptions for every project.
- Add a GitHub URL only when a repository exists.
- Keep website URLs optional; no website button is rendered without a verified URL.
- Derive the English and Chinese project counts from `profile.projects.length` so the count cannot become stale.
- Preserve the existing terminal output and new-tab link controls.

## Verification

- Before editing, confirm the current UI does not show ten projects.
- After editing, confirm `/projects` and `/项目` each show ten projects in the approved order.
- Confirm public and private GitHub destinations are rendered with `target="_blank"`.
- Run lint and a production build.

