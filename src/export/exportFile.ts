import { resolveDocumentTitle, toFileName } from '../markdown/meta';
import { PAGE_STYLE_ID } from './print';

/**
 * Triggers a browser download for a text payload.
 *
 * @param filename target file name including extension.
 * @param content file content.
 * @param mime MIME type of the blob.
 */
function downloadTextFile(
  filename: string,
  content: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Escapes text for interpolation into HTML markup.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Collects the text of every same-origin stylesheet on the page.
 *
 * Sheets that only make sense in the live app are skipped: paged.js
 * leftovers (`data-pagedjs-inserted-styles`) and the dynamic @page rule
 * (#md2pdf-page-style), whose paged-mode `margin: 0` would strip margins
 * if the exported file were printed.
 *
 * @returns concatenated CSS text; unreadable sheets are skipped.
 */
function collectCssText(): string {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    const owner = sheet.ownerNode;
    if (
      owner instanceof Element &&
      (owner.id === PAGE_STYLE_ID ||
        owner.hasAttribute('data-pagedjs-inserted-styles'))
    ) {
      continue;
    }
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        parts.push(rule.cssText);
      }
    } catch {
      // Cross-origin or otherwise unreadable stylesheet — skip it.
    }
  }
  return parts.join('\n');
}

const WOFF2_URL_PATTERN = /url\(\s*["']?([^"')]+\.woff2)["']?\s*\)/g;

/**
 * Reads a blob as a data URI.
 */
function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Replaces .woff2 URLs in the CSS with data URIs so the exported file
 * renders KaTeX fonts fully offline — the bundled font paths do not exist
 * next to a downloaded HTML file, and a CDN stylesheet would be a
 * render-blocking fetch that stalls first paint on slow or absent
 * networks.
 *
 * Only woff2 is embedded: KaTeX lists it first in every @font-face src,
 * so browsers never request the woff/ttf fallbacks.
 *
 * @param css collected stylesheet text.
 * @returns the rewritten CSS and the number of embedded fonts.
 */
async function embedFontUrls(
  css: string,
): Promise<{ css: string; embedded: number }> {
  const urls = [
    ...new Set([...css.matchAll(WOFF2_URL_PATTERN)].map((m) => m[1])),
  ];
  let embedded = 0;
  for (const url of urls) {
    try {
      const res = await fetch(new URL(url, document.baseURI));
      if (!res.ok) continue;
      const body = await res.arrayBuffer();
      const dataUri = await blobToDataUri(
        new Blob([body], { type: 'font/woff2' }),
      );
      css = css.split(url).join(dataUri);
      embedded += 1;
    } catch {
      // Font unreachable (e.g. dev-server path in a cold context); the
      // original relative URL stays and fails harmlessly at open time.
    }
  }
  return { css, embedded };
}

/**
 * Downloads the current markdown source as a .md file.
 *
 * @param source markdown text.
 */
export function exportMarkdown(source: string): void {
  const name = toFileName(resolveDocumentTitle(source));
  downloadTextFile(`${name}.md`, source, 'text/markdown');
}

/**
 * Downloads the rendered preview as a standalone .html file.
 *
 * All app styles are inlined. When the document contains math, the KaTeX
 * woff2 fonts are embedded as data URIs so the file works fully offline;
 * if every font fetch fails, the CDN stylesheet is kept as a render-
 * blocking fallback so math still gets correct fonts when online.
 * Mermaid diagrams are already inline SVG and need no extra handling.
 *
 * @param previewEl the rendered .markdown-body element.
 * @param source markdown text (used for the document title).
 */
export async function exportHtml(
  previewEl: HTMLElement,
  source: string,
): Promise<void> {
  const title = resolveDocumentTitle(source);
  let css = collectCssText();
  let cdnFallback = false;

  if (previewEl.querySelector('.katex')) {
    const result = await embedFontUrls(css);
    css = result.css;
    cdnFallback = result.embedded === 0;
  }

  const html = [
    '<!doctype html>',
    '<html><head>',
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${css}</style>`,
    cdnFallback
      ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" />'
      : '',
    '</head><body>',
    `<main class="markdown-body" style="max-width: 980px; margin: 0 auto; padding: 2rem;">${previewEl.innerHTML}</main>`,
    '</body></html>',
  ]
    .filter((line) => line !== '')
    .join('\n');
  downloadTextFile(`${toFileName(title)}.html`, html, 'text/html');
}
