# src/export/

PDF export and file downloads.

## Contents

- `print.ts` — the export flow: resolves the document title (front matter → first H1 → `document`), injects dynamic `@page` CSS plus a code-block wrap rule for the paged path, optionally paginates through paged.js into `#print-root`, then calls `window.print()`. After printing (or on failure) the paged.js polisher is destroyed so its injected `<head>` styles do not accumulate or leak into HTML exports.
- `pageSettings.ts` — `PageSettings` model, `buildPageCss()` (browser-facing `@page`: `size` + `margin`, with a zero sheet margin in paged mode) and `buildPagedPageCss()` (polisher-facing `@page`: real margin plus margin boxes for page numbers and running headers).
- `exportFile.ts` — `.md` and standalone `.html` downloads. All styles are inlined except paged.js leftovers and the dynamic `@page` sheet. When the document contains math, KaTeX woff2 fonts are embedded as data URIs so the file renders fully offline (a CDN stylesheet is kept only as a fallback when every font fetch fails).
- `pageSettings.test.ts` — CSS generation tests.
- `print.test.ts` — regression tests asserting the generated `@page` rules
  reach `document.head` (plain mode) and the paged.js polisher (paged mode),
  plus polisher teardown on `afterprint`.
- `exportFile.test.ts` — HTML export tests: meta tags, woff2 embedding,
  CDN fallback, and stylesheet filtering.

## Notes

Plain mode relies on the browser honoring `@page` size/margin (Chrome does;
paper size and margins chosen manually in the print dialog override CSS).
The `none` margin emits `margin: 0` — note that margin boxes (running
header, page numbers) need a nonzero margin to have room in paged mode.
Paged mode feeds `buildPagedPageCss()` to `Previewer.preview()` through its
`stylesheets` argument — the only channel paged.js parses `@page` rules
from — so format, orientation, margins, margin boxes and page counters all
apply to the generated page boxes. The DOM-facing `@page` deliberately omits
margin boxes (Chrome renders them natively, which would duplicate the boxes
paged.js draws), uses a zero sheet margin because the page boxes already
span the full sheet, and is re-appended after `preview()` because paged.js
inserts its own `@page { size: letter }` base rules into `<head>` and the
last `@page` wins. Page sizes are emitted as explicit mm dimensions rather
than keywords — the paged.js lookup table mixes cases ("A4" vs "legal") and
silently falls back to Letter on a miss. `#print-root` lives outside `#root` (created in
`main.tsx`) and stays rendered but invisible on screen — `display: none`
would null out `offsetParent` and crash the paged.js layout engine. It is
also kept BEFORE `#root` in DOM order: the paged clone duplicates every
heading id of the live preview, and Chrome resolves `#fragment` link
destinations by the first element carrying the id — letting the hidden
original win poisons the PDF named-destination map and turns TOC links
dead (verified: the generated PDF lacks its `/Dests` dictionary entirely). The head
`@page` style is installed unconditionally, so the caller's plain-print
fallback still honors the settings if `preview()` throws. The injected
`break-after: page` on the last `.pagedjs_page` would produce a trailing
blank sheet — `print.scss` overrides it under `body.paged-ready`.
