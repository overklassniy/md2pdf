# src/print/

PDF export and file downloads.

## Contents

- `print.ts` — the export flow: resolves the document title (front matter → first H1 → `document`), injects dynamic `@page` CSS, optionally paginates through paged.js into `#print-root`, then calls `window.print()`.
- `pageSettings.ts` — `PageSettings` model and `buildPageCss()` (`size`, `margin`, margin boxes for page numbers and running headers).
- `exportFile.ts` — `.md` and standalone `.html` downloads (all styles inlined; KaTeX fonts via CDN fallback).
- `pageSettings.test.ts` — CSS generation tests.

## Notes

Plain mode relies on the browser honoring `@page` size/margin (Chrome does).
Paged mode additionally understands margin boxes and page counters via
paged.js. `#print-root` lives outside `#root` (created in `main.tsx`) so the
app can be hidden entirely while printing pages.
