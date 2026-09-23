# src/

Application source code for md2pdf.

## Contents

- `main.tsx` — entry point: mounts React, registers the service worker, creates `#print-root` for paged.js output.
- `App.tsx` — shell: header, editor/preview split, status bar.
- `App.test.tsx` — app-level smoke test.
- `sample.ts` — default document; a live demo of every supported markdown feature.
- `vite-env.d.ts` — Vite and vite-plugin-pwa ambient types.
- `components/` — UI components (header, editor, preview, status bar, split area).
- `markdown/` — the unified/remark/rehype rendering pipeline and local plugins.
- `print/` — PDF print flow, `@page` settings, file export helpers.
- `state/` — React context store and localStorage persistence.
- `hooks/` — reusable hooks (scroll sync, drag-and-drop).
- `styles/` — global, print and preview SCSS.
- `test/` — vitest setup shared by all test files.
- `types/` — ambient declarations for untyped packages (pagedjs).

## Dependencies

React 19, CodeMirror 6, react-markdown. Imports flow downward only:
`components` use `state`, `hooks`, `markdown` and `print`; nothing here imports
upward into `main.tsx` except through `App`.
