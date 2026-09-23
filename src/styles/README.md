# src/styles/

Global SCSS (component styles live next to their components as `*.module.scss`).

## Contents

- `global.scss` — document layout (full-height app shell) and base font stack.
- `print.scss` — fragmentation rules (`break-inside`, `break-after`), the `.page-break` screen marker, and print-mode switching between the live preview and paged.js output.
- `markdown.scss` — preview styling on top of github-markdown-css: mermaid, directives, `mark`, inline TOC, KaTeX overflow, heading anchors.

## Notes

Fragmentation rules are deliberately unscoped (not inside `@media print`) —
paged.js paginates in screen context and must see them.
