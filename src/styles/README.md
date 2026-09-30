# src/styles/

Global SCSS (component styles live next to their components as `*.module.scss`).

## Contents

- `global.scss` – document layout (full-height app shell) and base font stack. The app height uses a `100%` → `100dvh` → `var(--app-height)` fallback chain (`--app-height` is set from `visualViewport.height` for the iOS keyboard), plus `overscroll-behavior`, tap-highlight and `touch-action` defaults. `.app__main--column` switches the split to stacked mode below 767.98px (driven from JS via `COMPACT_QUERY`).
- `print.scss` – fragmentation rules (`break-inside`, `break-after`), the `.page-break` screen marker, and print-mode switching between the live preview and paged.js output. Tables may fragment between rows (`tr` stays unbreakable); a whole-table `break-inside: avoid` would push tall tables to the next page and leave a gap. `#print-root` stays rendered on screen (`position: absolute` + `visibility: hidden`) because paged.js measures real layout and crashes inside `display: none`. A `body.paged-ready` override cancels `break-after` on the last `.pagedjs_page` – paged.js forces a page break after every page box, which would otherwise emit a trailing blank sheet.
- `markdown.scss` – preview styling on top of github-markdown-css: mermaid, directives, `mark`, inline TOC, KaTeX overflow, heading anchors (`.heading-anchor`, deliberately not `.anchor`; visible at reduced opacity on `hover: none` devices), footnote backref icon. On screens ≤767.98px wide tables scroll horizontally (screen-scoped so print is unaffected).

## Notes

Fragmentation rules are deliberately unscoped (not inside `@media print`) –
paged.js paginates in screen context and must see them.
