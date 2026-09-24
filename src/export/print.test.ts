import { beforeEach, describe, expect, it, vi } from 'vitest';
import { printDocument } from './print';
import { DEFAULT_PAGE_SETTINGS } from './pageSettings';

// preview() args captured per call: (content, stylesheets, renderTo).
const previewSpy = vi.hoisted(() => ({
  calls: [] as Array<[HTMLElement, unknown[], HTMLElement]>,
  destroySpy: vi.fn(),
}));

vi.mock('pagedjs', () => ({
  Previewer: class {
    polisher = { destroy: previewSpy.destroySpy };
    preview(
      content: HTMLElement,
      stylesheets: unknown[],
      renderTo: HTMLElement,
    ): Promise<void> {
      previewSpy.calls.push([content, stylesheets, renderTo]);
      return Promise.resolve();
    }
  },
}));

function makePreviewEl(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'markdown-body';
  el.textContent = 'content';
  return el;
}

describe('printDocument', () => {
  beforeEach(() => {
    // Flush afterprint listeners left registered by earlier tests.
    window.dispatchEvent(new Event('afterprint'));
    previewSpy.calls.length = 0;
    previewSpy.destroySpy.mockClear();
    window.print = vi.fn();
    document.getElementById('md2pdf-page-style')?.remove();
    document.getElementById('print-root')?.remove();
    document.body.classList.remove('paged-ready');
  });

  it('injects @page rules into the document head in plain mode', async () => {
    await printDocument({
      source: '# Doc',
      previewEl: makePreviewEl(),
      settings: {
        ...DEFAULT_PAGE_SETTINGS,
        format: 'Letter',
        margin: 'narrow',
      },
    });

    const el = document.getElementById('md2pdf-page-style');
    expect(el?.textContent).toContain('size: 215.9mm 279.4mm');
    expect(el?.textContent).toContain('margin: 10mm');
    expect(window.print).toHaveBeenCalled();
    expect(previewSpy.calls).toHaveLength(0);
  });

  it('passes the generated @page css to the paged.js polisher', async () => {
    await printDocument({
      source: '# Doc',
      previewEl: makePreviewEl(),
      settings: {
        ...DEFAULT_PAGE_SETTINGS,
        paged: true,
        format: 'Legal',
        orientation: 'landscape',
        margin: 'wide',
      },
    });

    expect(previewSpy.calls).toHaveLength(1);
    const [, stylesheets] = previewSpy.calls[0];
    const css = Object.values(stylesheets[0] as Record<string, string>)[0];
    expect(css).toContain('size: 355.6mm 215.9mm');
    expect(css).toContain('margin: 30mm');
    expect(window.print).toHaveBeenCalled();
    expect(document.body.classList.contains('paged-ready')).toBe(true);

    // The head @page keeps the print-time page setup consistent with the
    // generated boxes (full-sheet boxes need a zero sheet margin) and
    // covers the fallback print path if paged.js fails.
    const headStyle = document.getElementById('md2pdf-page-style');
    expect(headStyle?.textContent).toContain('size: 355.6mm 215.9mm');
    expect(headStyle?.textContent).toContain('margin: 0');
  });

  it('keeps margin boxes in the stylesheet passed to paged.js', async () => {
    await printDocument({
      source: '# Doc',
      previewEl: makePreviewEl(),
      settings: {
        ...DEFAULT_PAGE_SETTINGS,
        paged: true,
        headerText: 'My resume',
        pageNumbers: true,
      },
    });

    const [, stylesheets] = previewSpy.calls[0];
    const css = Object.values(stylesheets[0] as Record<string, string>)[0];
    expect(css).toContain('@top-center');
    expect(css).toContain('My resume');
    expect(css).toContain('counter(page)');
  });

  it('positions the paged output before #root so cloned ids win fragment lookup', async () => {
    const appRoot = document.createElement('div');
    appRoot.id = 'root';
    document.body.appendChild(appRoot);

    await printDocument({
      source: '# Doc',
      previewEl: makePreviewEl(),
      settings: { ...DEFAULT_PAGE_SETTINGS, paged: true },
    });

    // Chrome resolves internal (#fragment) link destinations by the first
    // element carrying the id in DOM order. The paged clone duplicates the
    // preview's heading ids, so it must come before the hidden #root or the
    // PDF destination map breaks and TOC links die.
    const ids = Array.from(document.body.children).map((c) => c.id);
    expect(ids.indexOf('print-root')).toBeLessThan(ids.indexOf('root'));
    appRoot.remove();
  });

  it('destroys the polisher on afterprint so injected head styles are removed', async () => {
    await printDocument({
      source: '# Doc',
      previewEl: makePreviewEl(),
      settings: { ...DEFAULT_PAGE_SETTINGS, paged: true },
    });

    expect(previewSpy.destroySpy).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('afterprint'));
    expect(previewSpy.destroySpy).toHaveBeenCalledTimes(1);
    expect(document.body.classList.contains('paged-ready')).toBe(false);
  });
});
