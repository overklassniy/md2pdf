# src/markdown/plugins/

Local remark/rehype plugins for syntax not covered by published packages.

## Contents

- `subsup.ts` — `^sup^` and `~sub~` with Pandoc rules (non-empty, no whitespace inside markers). Requires `remark-gfm` `singleTilde: false`.
- `directives.ts` — maps `:::name` container/leaf directives to styled elements: callouts (`note`, `tip`, `important`, `warning`, `caution`) with optional `[Label]` title, `:::pagebreak` → page break.
- `alertTitle.ts` — rewrites `> [!NOTE "Title"]` to the legacy `[!NOTE/Title]` form and gives bare `[!TYPE]` markers GitHub-style sentence-case titles; runs before `remarkAlert` (`legacyTitle`).
- `toc.ts` — `[TOC]` or `[TOC "Title"]` paragraph → `<nav class="inline-toc">` with a nested list of heading links slugged via `github-slugger` (matching `rehype-slug`).
- `pagebreak.ts` — standalone `\newpage`/`\pagebreak` paragraph → `<div class="page-break">`.
- `sourceline.ts` — rehype plugin stamping `data-source-line` on block elements (from mdast `position`) so scroll sync can map editor lines to preview offsets.

## Notes

All remark plugins emit `data.hName`/`hProperties` so `remark-rehype` produces
the target elements without custom hast handlers.
