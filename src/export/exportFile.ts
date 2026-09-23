import { resolveDocumentTitle, toFileName } from '../markdown/meta';

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
 * @returns concatenated CSS text; unreadable sheets are skipped.
 */
function collectCssText(): string {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
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
 * All app styles are inlined; KaTeX fonts are referenced from a CDN link so
 * math keeps rendering when the file is opened elsewhere. Mermaid diagrams
 * are already inline SVG and need no extra handling.
 *
 * @param previewEl the rendered .markdown-body element.
 * @param source markdown text (used for the document title).
 */
export function exportHtml(previewEl: HTMLElement, source: string): void {
  const title = resolveDocumentTitle(source);
  const css = collectCssText();
  const html = [
    '<!doctype html>',
    '<html lang="en"><head>',
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${css}</style>`,
    // Font files referenced by the inlined KaTeX CSS are build-time hashed,
    // so a CDN stylesheet is linked as a font fallback.
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" />',
    '</head><body>',
    `<main class="markdown-body" style="max-width: 980px; margin: 0 auto; padding: 2rem;">${previewEl.innerHTML}</main>`,
    '</body></html>',
  ].join('\n');
  downloadTextFile(`${toFileName(title)}.html`, html, 'text/html');
}
