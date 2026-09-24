import { describe, expect, it } from 'vitest';
import {
  buildPageCss,
  buildPagedPageCss,
  DEFAULT_PAGE_SETTINGS,
} from './pageSettings';

describe('buildPageCss', () => {
  it('emits explicit size dimensions and margin', () => {
    const css = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      format: 'Letter',
      orientation: 'landscape',
      margin: 'narrow',
    });
    // Landscape swaps width/height; lengths avoid the case-sensitive
    // page-size keyword table in paged.js ("Legal" would miss "legal").
    expect(css).toContain('size: 279.4mm 215.9mm');
    expect(css).toContain('margin: 10mm');
  });

  it('emits a zero margin for the none option', () => {
    const css = buildPageCss({ ...DEFAULT_PAGE_SETTINGS, margin: 'none' });
    expect(css).toContain('margin: 0');
  });

  it('emits A4 portrait dimensions', () => {
    const css = buildPageCss(DEFAULT_PAGE_SETTINGS);
    expect(css).toContain('size: 210mm 297mm');
  });

  it('uses a zero sheet margin in paged mode', () => {
    // The paged.js page boxes are full-sheet sized and carry the chosen
    // margin inside; a nonzero sheet margin would squeeze them.
    const css = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      margin: 'wide',
    });
    expect(css).toContain('margin: 0');
    expect(css).not.toContain('margin: 30mm');
  });

  it('never emits margin boxes', () => {
    // Chrome renders margin boxes natively; keeping them out of the DOM CSS
    // prevents duplication with the boxes paged.js draws itself.
    const css = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      pageNumbers: true,
      headerText: 'Resume',
    });
    expect(css).not.toContain('@bottom-center');
    expect(css).not.toContain('@top-center');
  });
});

describe('buildPagedPageCss', () => {
  it('carries the real margin for the paged.js content area', () => {
    const css = buildPagedPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      margin: 'wide',
    });
    expect(css).toContain('margin: 30mm');
  });

  it('adds margin boxes for headers and page numbers', () => {
    const css = buildPagedPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      pageNumbers: true,
      headerText: 'Resume',
    });
    expect(css).toContain('@bottom-center');
    expect(css).toContain('counter(page)');
    expect(css).toContain('@top-center');
    expect(css).toContain('"Resume"');
  });

  it('omits margin boxes when both are disabled', () => {
    const css = buildPagedPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      pageNumbers: false,
      headerText: '',
    });
    expect(css).not.toContain('@bottom-center');
    expect(css).not.toContain('@top-center');
  });

  it('escapes quotes in the running header', () => {
    const css = buildPagedPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      headerText: 'say "hi"',
    });
    expect(css).toContain('say \\"hi\\"');
  });
});
