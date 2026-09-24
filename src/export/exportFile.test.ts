import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportHtml } from './exportFile';

let captured: Blob | undefined;

function addStyle(text: string, attrs: Record<string, string> = {}): void {
  const el = document.createElement('style');
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.textContent = text;
  document.head.appendChild(el);
}

function makePreviewEl(withMath: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'markdown-body';
  el.innerHTML = withMath
    ? '<p>text</p><span class="katex">x</span>'
    : '<p>text</p>';
  return el;
}

async function exportedHtml(): Promise<string> {
  if (!captured) throw new Error('no download captured');
  return captured.text();
}

beforeEach(() => {
  captured = undefined;
  URL.createObjectURL = vi.fn((blob: Blob) => {
    captured = blob;
    return 'blob:mock';
  }) as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(new Uint8Array([1, 2, 3]))),
  );
});

afterEach(() => {
  document.head
    .querySelectorAll('style')
    .forEach((el) => el.parentNode?.removeChild(el));
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('exportHtml', () => {
  it('embeds woff2 fonts as data URIs when the document has math', async () => {
    addStyle('.f { background: url(assets/KaTeX_Main-Regular.woff2); }');
    await exportHtml(makePreviewEl(true), '# Doc');

    const html = await exportedHtml();
    expect(fetch).toHaveBeenCalled();
    expect(html).toContain('data:font/woff2;base64,');
    expect(html).not.toContain('cdn.jsdelivr.net');
  });

  it('fetches no fonts and links nothing when there is no math', async () => {
    addStyle('.f { background: url(assets/KaTeX_Main-Regular.woff2); }');
    await exportHtml(makePreviewEl(false), '# Doc');

    const html = await exportedHtml();
    expect(fetch).not.toHaveBeenCalled();
    expect(html).not.toContain('cdn.jsdelivr.net');
    expect(html).not.toContain('data:font/woff2');
  });

  it('keeps the CDN stylesheet when every font fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 404 })),
    );
    addStyle('.f { background: url(assets/KaTeX_Main-Regular.woff2); }');
    await exportHtml(makePreviewEl(true), '# Doc');

    const html = await exportedHtml();
    expect(html).toContain('cdn.jsdelivr.net');
    expect(html).not.toContain('data:font/woff2');
  });

  it('excludes paged.js injected styles and the dynamic @page rule', async () => {
    addStyle('.app-marker { color: red; }');
    addStyle('.pagedjs-marker { color: red; }', {
      'data-pagedjs-inserted-styles': 'true',
    });
    await exportHtml(makePreviewEl(false), '# Doc');

    const html = await exportedHtml();
    expect(html).toContain('.app-marker');
    expect(html).not.toContain('.pagedjs-marker');
  });
});
