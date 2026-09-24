# src/markdown/

The unified (remark/rehype) rendering pipeline.

## Contents

- `pipeline.ts` — ordered remark and rehype plugin arrays plus `remarkRehypeOptions` (definition-list handlers, SVG footnote backref icon). Single source of truth for the markdown dialect.
- `components.tsx` — react-markdown element overrides; intercepts ` ```mermaid ` blocks at the `pre` level.
- `meta.ts` — YAML front matter parsing, document title resolution (front matter `title` → first H1 → `document`) and file-name sanitizing. `title` is the only metadata field Chromium's print-to-PDF writes into the PDF.
- `plugins/` — local remark/rehype plugins: sub/superscript, directive mapping, alert titles, inline TOC, page breaks, source-line markers.
- `pipeline.test.tsx`, `meta.test.ts` — feature-level tests.

## Dependencies

Everything markdown-related funnels through this folder: GFM, alerts, math,
mermaid hand-off, extended syntax, directives and front matter. The preview
(`components/Preview`) is the only consumer.
