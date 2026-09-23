import { describe, expect, it } from 'vitest';
import { buildPageCss, DEFAULT_PAGE_SETTINGS } from './pageSettings';

describe('buildPageCss', () => {
  it('emits size and margin', () => {
    const css = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      format: 'Letter',
      orientation: 'landscape',
      margin: 'narrow',
    });
    expect(css).toContain('size: Letter landscape');
    expect(css).toContain('margin: 10mm');
  });

  it('adds margin boxes only in paged mode', () => {
    const plain = buildPageCss({ ...DEFAULT_PAGE_SETTINGS, paged: false });
    expect(plain).not.toContain('@bottom-center');

    const paged = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      pageNumbers: true,
      headerText: 'Resume',
    });
    expect(paged).toContain('@bottom-center');
    expect(paged).toContain('counter(page)');
    expect(paged).toContain('@top-center');
    expect(paged).toContain('"Resume"');
  });

  it('escapes quotes in the running header', () => {
    const css = buildPageCss({
      ...DEFAULT_PAGE_SETTINGS,
      paged: true,
      headerText: 'say "hi"',
    });
    expect(css).toContain('say \\"hi\\"');
  });
});
