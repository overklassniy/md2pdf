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
  margin: 'none' | 'narrow' | 'normal' | 'wide';
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
  none: '0',
  narrow: '10mm',
  normal: '20mm',
  wide: '30mm',
};

// Dimensions in mm. Keywords are avoided because paged.js looks them up in a
// case-sensitive table whose keys mix cases ("A4" vs "letter"/"legal"), so
// "Legal" silently falls back to the 8.5x11in default. Explicit lengths also
// keep the output identical between the browser and the polisher.
const PAGE_DIMENSIONS: Record<PageSettings['format'], [number, number]> = {
  A4: [210, 297],
  Letter: [215.9, 279.4],
  Legal: [215.9, 355.6],
};

/**
 * Returns the `size` declaration value for the current settings.
 *
 * @param settings current page settings.
 * @returns two lengths in mm, swapped for landscape.
 */
function pageSizeValue(settings: PageSettings): string {
  const [w, h] = PAGE_DIMENSIONS[settings.format];
  return settings.orientation === 'landscape' ? `${h}mm ${w}mm` : `${w}mm ${h}mm`;
}

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
 * Builds the `@page` rule injected into the document and read by the
 * browser's print engine.
 *
 * In paged mode the sheet margin must be zero: the generated page boxes are
 * already full-sheet sized and carry the chosen margins inside themselves,
 * so a nonzero sheet margin would squeeze them. Margin boxes are also
 * omitted here — modern Chrome renders them natively, which would duplicate
 * the margin boxes paged.js draws as DOM elements.
 *
 * @param settings current page settings.
 * @returns CSS text to inject into a style element.
 */
export function buildPageCss(settings: PageSettings): string {
  const margin = settings.paged ? '0' : MARGIN_VALUES[settings.margin];
  return `@page { size: ${pageSizeValue(settings)}; margin: ${margin}; }`;
}

/**
 * Builds the `@page` rule handed to the paged.js polisher through the
 * `stylesheets` argument of `Previewer.preview()`. Unlike the DOM variant,
 * this one carries the real margin (paged.js uses it to size the content
 * area inside each page box) and the margin boxes for running headers and
 * page numbers, which paged.js renders as DOM elements.
 *
 * @param settings current page settings.
 * @returns CSS text for the paged.js polisher only.
 */
export function buildPagedPageCss(settings: PageSettings): string {
  const margin = MARGIN_VALUES[settings.margin];
  const marginBoxes: string[] = [];

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

  return [
    `@page { size: ${pageSizeValue(settings)}; margin: ${margin};`,
    ...marginBoxes.map((box) => `  ${box}`),
    '}',
  ].join('\n');
}
