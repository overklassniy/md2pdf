# md2pdf

Offline Markdown-to-PDF workspace. Edit Markdown, preview the printed page, and
export to PDF — entirely in the browser. As an installable PWA the app and every
asset it needs (including KaTeX fonts) are cached locally: no server-side
processing, no uploads.

## Quick start

```bash
docker run -d -p 8080:80 overklassniy/md2pdf
```

Open http://localhost:8080

The image is a scratch container — a single static web server binary plus the
prebuilt app, about 5 MB plus the app bundle. The same image is published to
GHCR:

```bash
docker run -d -p 8080:80 ghcr.io/overklassniy/md2pdf
```

## Tags

- `latest` — latest stable release
- `dev` — latest build of the `master` branch
- `x.y.z`, `x.y`, `x` — semantic version tags for each release

## Features

- Fully offline PWA, zero network requests after first load.
- Live preview with scroll sync; drag-and-drop or paste images into the editor.
- Browser print-to-PDF, or paged.js pagination with page numbers and running
  headers.
- Standalone HTML export: all styles inlined, KaTeX fonts embedded as data URIs.
- Page setup: A4 / Letter / Legal, portrait or landscape, margin presets.
- GFM, KaTeX math, Mermaid diagrams, alerts, callouts, table of contents,
  YAML front matter, and more.

## Links

- Source code: https://github.com/overklassniy/md2pdf
- Issues: https://github.com/overklassniy/md2pdf/issues
- License: MIT
