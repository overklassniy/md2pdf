import type { Polisher } from 'pagedjs';
import { resolveDocumentTitle } from '../markdown/meta';
import {
  buildPageCss,
  buildPagedPageCss,
  type PageSettings,
} from './pageSettings';

const PRINT_ROOT_ID = 'print-root';
export const PAGE_STYLE_ID = 'md2pdf-page-style';

interface PrintOptions {
  /** Current markdown source (used to resolve the document title). */
  source: string;
  /** The rendered .markdown-body element to print. */
  previewEl: HTMLElement;
  settings: PageSettings;
}

/**
 * Ensures the dynamic @page style element exists and carries current rules.
 *
 * @param css generated @page CSS text.
 */
function ensurePageStyle(css: string): void {
  let el = document.getElementById(PAGE_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = PAGE_STYLE_ID;
  }
  // Always (re)append: paged.js inserts its own "@page { size: letter }"
  // base rules into <head> during preview, and @page rules cascade by
  // document order — the last element wins.
  document.head.appendChild(el);
  el.textContent = css;
}

/**
 * Returns the hidden container that receives paged.js output. It must live
 * outside #root because the whole app root is hidden while printing paged
 * output, and must precede it in DOM order: the paged clone duplicates the
 * preview's heading ids, and Chrome registers internal link destinations by
 * the first element carrying the id — a hidden original poisons the PDF
 * named-destination map and kills TOC links.
 */
function getPrintRoot(): HTMLElement {
  let root = document.getElementById(PRINT_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = PRINT_ROOT_ID;
  }
  document.body.insertBefore(root, document.getElementById('root'));
  return root;
}

/**
 * Builds the wrapper handed to paged.js: clones of every app stylesheet
 * (<style> and <link rel="stylesheet">) so bundled CSS (github-markdown,
 * KaTeX, highlight.js, app styles) applies inside the generated pages,
 * plus the generated @page rules, plus a clone of the preview content.
 *
 * @param previewEl live preview element (cloned, not moved).
 * @param settings current page settings.
 * @returns a detached wrapper element for Previewer.preview().
 */
function buildPagedContent(
  previewEl: HTMLElement,
  settings: PageSettings,
): HTMLElement {
  const wrapper = document.createElement('div');

  document
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((el) => wrapper.appendChild(el.cloneNode(true)));

  const pageStyle = document.createElement('style');
  pageStyle.textContent = buildPageCss(settings);
  wrapper.appendChild(pageStyle);

  // paged.js lays out in screen context where @media print rules do not
  // apply; long code lines must wrap here the same way print.scss wraps
  // them for the plain print path.
  const preWrap = document.createElement('style');
  preWrap.textContent = '.markdown-body pre { white-space: pre-wrap; }';
  wrapper.appendChild(preWrap);

  wrapper.appendChild(previewEl.cloneNode(true));
  return wrapper;
}

/**
 * Exports the document to PDF via the browser print flow.
 *
 * Plain mode: dynamic @page rules + print CSS, then window.print().
 * Paged mode: content is flowed through paged.js into #print-root (adding
 * page numbers and running headers), then printed.
 *
 * @param options source text, preview element and page settings.
 */
export async function printDocument(options: PrintOptions): Promise<void> {
  const { source, previewEl, settings } = options;
  const previousTitle = document.title;
  document.title = resolveDocumentTitle(source);

  // Kept unconditional: in paged mode the head @page must match the page
  // boxes generated below, and if paged.js fails the caller's fallback
  // window.print() still honors the current settings.
  ensurePageStyle(buildPageCss(settings));

  if (!settings.paged) {
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
    return;
  }

  const printRoot = getPrintRoot();
  printRoot.innerHTML = '';

  let polisher: Polisher | undefined;

  const cleanup = () => {
    // Removes the <style data-pagedjs-inserted-styles> elements paged.js
    // added to <head>. Left in place they would accumulate on every paged
    // print and leak into standalone HTML exports via collectCssText().
    // destroy() on a polisher whose setup() never ran throws, so teardown
    // is best-effort.
    try {
      polisher?.destroy();
    } catch {
      // best-effort teardown
    }
    document.body.classList.remove('paged-ready');
    printRoot.innerHTML = '';
    document.title = previousTitle;
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  try {
    const { Previewer } = await import('pagedjs');
    const previewer = new Previewer();
    polisher = previewer.polisher;
    // The stylesheets argument is the only channel through which @page rules
    // reach the paged.js polisher; passing [] makes every page box fall back
    // to Letter with 1in margins regardless of the settings. The {url: css}
    // object form inlines our generated rules without a fetch.
    await previewer.preview(
      buildPagedContent(previewEl, settings),
      [{ [window.location.href]: buildPagedPageCss(settings) }],
      printRoot,
    );
    // paged.js's setup inserted its base "@page { size: letter; margin: 0 }"
    // after our style element; re-appending restores the intended order.
    ensurePageStyle(buildPageCss(settings));
    document.body.classList.add('paged-ready');
    window.print();
  } catch (err) {
    cleanup();
    throw err;
  }
}
