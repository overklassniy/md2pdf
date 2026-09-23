import { resolveDocumentTitle } from '../markdown/meta';
import { buildPageCss, type PageSettings } from './pageSettings';

const PRINT_ROOT_ID = 'print-root';
const PAGE_STYLE_ID = 'md2pdf-page-style';

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
    document.head.appendChild(el);
  }
  el.textContent = css;
}

/**
 * Returns the hidden container that receives paged.js output. It must live
 * outside #root because the whole app root is hidden while printing paged
 * output.
 */
function getPrintRoot(): HTMLElement {
  let root = document.getElementById(PRINT_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = PRINT_ROOT_ID;
    document.body.appendChild(root);
  }
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

  if (!settings.paged) {
    ensurePageStyle(buildPageCss(settings));
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

  const cleanup = () => {
    document.body.classList.remove('paged-ready');
    printRoot.innerHTML = '';
    document.title = previousTitle;
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  try {
    const { Previewer } = await import('pagedjs');
    const previewer = new Previewer();
    await previewer.preview(
      buildPagedContent(previewEl, settings),
      [],
      printRoot,
    );
    document.body.classList.add('paged-ready');
    window.print();
  } catch (err) {
    cleanup();
    throw err;
  }
}
