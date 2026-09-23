/**
 * Page setup model used by the print pipeline.
 *
 * Two export modes exist:
 * - plain mode relies on the browser print dialog plus the `@page` size and
 *   margin rules generated here;
 * - paged mode additionally runs paged.js, which understands margin boxes
 *   (@top-center, @bottom-center) and page counters.
 */
export interface PageSettings {
  format: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margin: 'narrow' | 'normal' | 'wide';
  /** Enable paged.js pagination (page numbers, running header/footer). */
  paged: boolean;
  /** Text rendered in the top-center margin box of every page. */
  headerText: string;
  /** Render "page / total" in the bottom-center margin box. */
  pageNumbers: boolean;
}

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  format: 'A4',
  orientation: 'portrait',
  margin: 'normal',
  paged: false,
  headerText: '',
  pageNumbers: true,
};

const MARGIN_VALUES: Record<PageSettings['margin'], string> = {
  narrow: '10mm',
  normal: '20mm',
  wide: '30mm',
};

/**
 * Escapes a string for use inside a CSS `content` value.
 *
 * @param value raw user input.
 * @returns the value with characters that would break the declaration escaped.
 */
function escapeCssContent(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

/**
 * Builds the `@page` rule for the current settings.
 *
 * Margin boxes are only meaningful to paged.js; browsers ignore them when
 * the declaration is applied without the polyfill.
 *
 * @param settings current page settings.
 * @returns CSS text to inject into a style element.
 */
export function buildPageCss(settings: PageSettings): string {
  const margin = MARGIN_VALUES[settings.margin];
  const marginBoxes: string[] = [];

  if (settings.paged) {
    if (settings.headerText.trim()) {
      marginBoxes.push(
        `@top-center { content: "${escapeCssContent(settings.headerText.trim())}"; font-size: 9pt; color: #57606a; }`,
      );
    }
    if (settings.pageNumbers) {
      marginBoxes.push(
        '@bottom-center { content: counter(page) " / " counter(pages); font-size: 9pt; color: #57606a; }',
      );
    }
  }

  return [
    `@page { size: ${settings.format} ${settings.orientation}; margin: ${margin};`,
    ...marginBoxes.map((box) => `  ${box}`),
    '}',
  ].join('\n');
}
