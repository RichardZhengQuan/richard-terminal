# Portfolio update — 2026-11-16

This release carries the reviewed bilingual portfolio from the local preview into the main source branch.

- Use 郑荃 in Chinese and Richard Q in English, with the Chinese verse and large English name fixed behind the page.
- Keep the four fanned focus cards, retain their edge labels when selected, and show concise examples on each card.
- Show the owner-supplied journey in reverse chronological chapters: 2026.10 entrepreneurship, 2020.08 Beijing tech-company experience, 2018.03 entrepreneurship, and 2016.08 product mentorship. Promotion dates are intentionally unassigned.
- Give the three career roles and the two 2018 organizations individual illustrated cards. Use the approved English organization names and translated book title.
- Feature OneMind, place NEO and usAIge together, and keep the other nine projects in the smaller grid. Preserve all 12 projects, their available links, complete text, and the 6px artwork blur.
- Align focus areas with Product, Design, Business, and Technology.

## Publication boundary

The source PR excludes unrelated local operations records, hosted project sources, legacy cloth demos, cloud-sync duplicates, generated outputs, and the shared checkout index. Production packaging overlays the new static homepage build onto a verified copy of the active portfolio release, preserving existing hosted project pages, downloads, discovery files, and old immutable assets. No nginx or other project-service changes are needed. The preceding release remains available for atomic rollback.

Build, type, lint, browser, and public-deployment evidence are recorded independently in the release report; a merged PR alone does not establish production activation.
