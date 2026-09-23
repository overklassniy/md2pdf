# md2pdf

Awesome **Markdown to PDF**, fully offline. A client-side editor + preview that prints to PDF through the browser — no server ever sees your document.

[简体中文(Simplified Chinese)](./README_cn.md) | [繁體中文(Traditional Chinese)](./README_tc.md)

## How to use

1. Click **Choose** (or drag a `.md` file anywhere onto the window) to load a document.
2. Edit in the left panel — the preview on the right updates live.
3. Click **Export → Print / Save as PDF**.
4. In the print dialog switch **Destination** to _Save as PDF_. Chrome is recommended.

Your draft is auto-saved to localStorage, so a refresh never loses work. **Reset** restores the feature-tour sample.

## Supported Markdown

| Feature           | Syntax                                                                               | Notes                                         |
| ----------------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| GFM               | tables, `- [x]` tasks, `~~strike~~`, autolinks, `[^footnotes]`                       | full GitHub-flavored baseline                 |
| Alerts            | `> [!NOTE]` `[!TIP]` `[!IMPORTANT]` `[!WARNING]` `[!CAUTION]`                        | rendered like github.com                      |
| Math              | `$...$`, `$$...$$`                                                                   | KaTeX                                         |
| Diagrams          | ` ```mermaid `                                                                       | flowchart, sequence, gantt, etc., lazy-loaded |
| Highlight         | `==marked==`                                                                         | `<mark>`                                      |
| Sub/Superscript   | `H~2~O`, `x^2^`                                                                      | Pandoc rules — no spaces inside markers       |
| Emoji             | `:rocket:`                                                                           | GitHub shortcodes                             |
| Definition lists  | `Term` + `: definition`                                                              | PHP Markdown Extra style                      |
| Smart punctuation | `"quotes"`, `--`, `...`                                                              | typographic dashes/quotes                     |
| Front matter      | `---\ntitle: …\n---`                                                                 | `title` becomes the PDF file name             |
| Containers        | `:::note`, `:::tip`, `:::warning`, `:::caution`, `:::important`, `:::details[Label]` | Docusaurus-style directives                   |
| Table of contents | `[TOC]` on its own line                                                              | linked outline of H1–H3                       |
| Page break        | `\newpage` or `\pagebreak` paragraph, or `:::pagebreak`                              | starts a fresh PDF page                       |
| Raw HTML          | `<span style="color:red">…`                                                          | always enabled — the app is local-only        |

Images pasted or dropped into the editor are embedded as base64 data URIs, so the exported PDF/HTML is fully self-contained.

## Export

- **Print / Save as PDF** — the document title (front matter `title` or the first `#` heading) becomes the suggested file name.
- **Download .md / .html** — raw source or a standalone HTML snapshot.
- **Page setup** — paper format (A4/Letter/Legal), orientation, margin presets.
- **Advanced pagination** — enable _paged.js_ mode to get real page numbers (`N / total`) and a running header on every page.

## Editor

- CodeMirror 6 with markdown (GFM) syntax highlighting.
- Drag the bar between the panes to resize; **Sync scroll** links scrolling.
- Status bar: words, characters, lines, cursor position.

## Offline / PWA

The app is a Progressive Web App: after the first visit it works fully offline and can be installed (service worker via vite-plugin-pwa).

## Using Docker

1. Install Docker.
2. Clone the repository and `cd` into it.
3. Run `docker compose up -d`.

The compose file binds the app to `localhost:8080` (nginx serving the static `dist/` build). Change the `ports` line in `docker-compose.yaml` to use another port.

## Development

Requires Node.js ≥ 20.19 and pnpm (via `corepack enable`).

```bash
pnpm install        # install dependencies
pnpm dev            # dev server
pnpm build          # production build → dist/
pnpm preview        # serve the production build
pnpm test           # vitest suite
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
```

Tech: Vite 8, React 19, TypeScript, react-markdown (unified/remark/rehype), CodeMirror 6, SCSS modules, vite-plugin-pwa.

## Tips

- In the print dialog, toggle **Headers and footers** off for a clean PDF.
- Long diagrams and wide formulas scroll on screen but paginate cleanly in print.

LICENSE MIT © 2019 realdennis, © 2026 overklassniy
