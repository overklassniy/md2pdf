# src/markdown/

The unified (remark/rehype) rendering pipeline.

## Contents

- `pipeline.ts` — ordered remark and rehype plugin arrays plus `remarkRehypeOptions` (definition-list handlers). Single source of truth for the markdown dialect.
- `components.tsx` — react-markdown element overrides; intercepts ` ```mermaid ` blocks at the `pre` level.
- `meta.ts` — YAML front matter parsing and document-title/file-name resolution.
- `plugins/` — local remark plugins: sub/superscript, directive mapping, inline TOC, page breaks.
- `pipeline.test.tsx`, `meta.test.ts` — feature-level tests.

## Dependencies

Everything markdown-related funnels through this folder: GFM, alerts, math,
mermaid hand-off, extended syntax, directives and front matter. The preview
(`components/Preview`) is the only consumer.
