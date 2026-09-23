# src/markdown/plugins/

Local remark plugins for syntax not covered by published packages.

## Contents

- `subsup.ts` — `^sup^` and `~sub~` with Pandoc rules (non-empty, no whitespace inside markers). Requires `remark-gfm` `singleTilde: false`.
- `directives.ts` — maps `:::name` container/leaf directives to styled elements: callouts (`note`, `tip`, `important`, `warning`, `caution`), `:::details[Label]` → `<details>/<summary>`, `:::pagebreak` → page break.
- `toc.ts` — `[TOC]` paragraph → `<nav class="inline-toc">` with a nested list of heading links slugged via `github-slugger` (matching `rehype-slug`).
- `pagebreak.ts` — standalone `\newpage`/`\pagebreak` paragraph → `<div class="page-break">`.

## Notes

All plugins emit `data.hName`/`hProperties` so `remark-rehype` produces the
target elements without custom hast handlers.
