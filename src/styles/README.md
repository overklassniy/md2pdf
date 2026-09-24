# src/styles/

Global SCSS (component styles live next to their components as `*.module.scss`).

## Contents

- `global.scss` — document layout (full-height app shell) and base font stack.
- `print.scss` — fragmentation rules (`break-inside`, `break-after`), the `.page-break` screen marker, and print-mode switching between the live preview and paged.js output. `#print-root` stays rendered on screen (`position: absolute` + `visibility: hidden`) because paged.js measures real layout and crashes inside `display: none`. A `body.paged-ready` override cancels `break-after` on the last `.pagedjs_page` — paged.js forces a page break after every page box, which would otherwise emit a trailing blank sheet.
- `markdown.scss` — preview styling on top of github-markdown-css: mermaid, directives, `mark`, inline TOC, KaTeX overflow, heading anchors (`.heading-anchor`, deliberately not `.anchor`), footnote backref icon.

## Notes

Fragmentation rules are deliberately unscoped (not inside `@media print`) —
paged.js paginates in screen context and must see them.
