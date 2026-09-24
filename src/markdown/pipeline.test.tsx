import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Markdown from 'react-markdown';
import { remarkPlugins, rehypePlugins, remarkRehypeOptions } from './pipeline';
import { markdownComponents, markdownUrlTransform } from './components';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async () => ({ svg: '<svg data-testid="mmd"></svg>' })),
  },
}));

function renderMd(source: string) {
  return render(
    <Markdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      remarkRehypeOptions={remarkRehypeOptions}
      components={markdownComponents}
      urlTransform={markdownUrlTransform}
    >
      {source}
    </Markdown>,
  );
}

describe('markdown pipeline', () => {
  it('renders GFM tables, task lists and strikethrough', () => {
    const { container } = renderMd(
      '| a |\n| - |\n| 1 |\n\n- [x] done\n\n~~gone~~',
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(
      container.querySelector('input[type="checkbox"][disabled]'),
    ).toBeInTheDocument();
    expect(container.querySelector('del')).toHaveTextContent('gone');
  });

  it('autolinks bare URLs and renders footnotes', () => {
    const { container } = renderMd(
      'visit https://example.com now\n\nnote[^a]\n\n[^a]: footnote body',
    );
    expect(
      container.querySelector('a[href="https://example.com"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('.footnotes')).toBeInTheDocument();
  });

  it('renders GitHub alerts', () => {
    const { container } = renderMd('> [!NOTE]\n> remember this');
    expect(container.querySelector('.markdown-alert')).toBeInTheDocument();
  });

  it('renders inline and display math via KaTeX', () => {
    const { container } = renderMd('inline $x^2$ and\n\n$$y = mx + b$$');
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(0);
  });

  it('renders ==mark==, ~sub~ and ^sup^', () => {
    const { container } = renderMd('==hi== H~2~O x^2^');
    expect(container.querySelector('mark')).toHaveTextContent('hi');
    expect(container.querySelector('sub')).toHaveTextContent('2');
    expect(container.querySelector('sup')).toHaveTextContent('2');
  });

  it('does not corrupt prose that merely resembles sub/sup markers', () => {
    const { container } = renderMd('x^2 + y^2 and ~/.config plus ~/.bashrc');
    expect(container.querySelector('sup')).not.toBeInTheDocument();
    expect(container.querySelector('sub')).not.toBeInTheDocument();
  });

  it('keeps ~~double tilde~~ as strikethrough, not subscript', () => {
    const { container } = renderMd('~~del~~');
    expect(container.querySelector('del')).toHaveTextContent('del');
    expect(container.querySelector('sub')).not.toBeInTheDocument();
  });

  it('renders emoji shortcodes', () => {
    const { container } = renderMd(':rocket:');
    expect(container).toHaveTextContent('🚀');
  });

  it('renders definition lists', () => {
    const { container } = renderMd('Term\n:   definition text');
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toHaveTextContent('Term');
    expect(container.querySelector('dd')).toHaveTextContent('definition');
  });

  it('maps :::note containers to styled divs', () => {
    const { container } = renderMd(':::note[Custom]\nbody\n:::');
    const el = container.querySelector('.directive--note');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('body');
    expect(el?.querySelector('.directive-title')).toHaveTextContent('Custom');
  });

  it('turns \\newpage into a page-break element', () => {
    const { container } = renderMd('before\n\n\\newpage\n\nafter');
    expect(container.querySelector('.page-break')).toBeInTheDocument();
  });

  it('replaces [TOC] with a linked table of contents', () => {
    const { container } = renderMd('[TOC]\n\n## Alpha\n\n## Beta');
    const toc = container.querySelector('.inline-toc');
    expect(toc).toBeInTheDocument();
    expect(toc?.querySelector('a[href="#alpha"]')).toHaveTextContent('Alpha');
    expect(toc?.querySelector('a[href="#beta"]')).toHaveTextContent('Beta');
    expect(toc?.querySelector('.inline-toc__title')).toHaveTextContent(
      'Contents',
    );
  });

  it('renders a custom TOC title from [TOC "Title"]', () => {
    const { container } = renderMd('[TOC "My index"]\n\n## Alpha');
    expect(container.querySelector('.inline-toc__title')).toHaveTextContent(
      'My index',
    );
  });

  it('renders GitHub-cased alert titles and quoted custom titles', () => {
    const { container } = renderMd(
      '> [!CAUTION]\n> risky\n\n> [!NOTE "Read me"]\n> body',
    );
    const alerts = container.querySelectorAll('.markdown-alert');
    expect(alerts[0].querySelector('.markdown-alert-title')).toHaveTextContent(
      'Caution',
    );
    expect(alerts[1].querySelector('.markdown-alert-title')).toHaveTextContent(
      'Read me',
    );
  });

  it('renders an svg footnote backref instead of the emoji glyph', () => {
    const { container } = renderMd('note[^a]\n\n[^a]: body');
    expect(
      container.querySelector('.data-footnote-backref svg'),
    ).toBeInTheDocument();
    expect(container.querySelector('.footnotes')).not.toHaveTextContent('↩');
  });

  it('stamps data-source-line on block elements for scroll sync', () => {
    const { container } = renderMd('# Title\n\npara\n\n## Sub');
    expect(container.querySelector('h1')).toHaveAttribute(
      'data-source-line',
      '1',
    );
    expect(container.querySelector('h2')).toHaveAttribute(
      'data-source-line',
      '5',
    );
  });

  it('strips front matter from the rendered output', () => {
    const { container } = renderMd('---\ntitle: Doc\n---\n\nBody');
    expect(container).toHaveTextContent('Body');
    expect(container).not.toHaveTextContent('title: Doc');
  });

  it('renders raw HTML and smart punctuation', () => {
    const { container } = renderMd(
      '<span class="custom">x</span> and "quotes"',
    );
    expect(container.querySelector('span.custom')).toBeInTheDocument();
    expect(container.textContent).toContain('\u201C');
  });

  it('adds slug ids to headings', () => {
    const { container } = renderMd('## Hello World');
    expect(container.querySelector('h2#hello-world')).toBeInTheDocument();
  });

  it('renders mermaid fences via the diagram component', async () => {
    renderMd('```mermaid\nflowchart LR\n  a --> b\n```');
    expect(
      await screen.findByText('', { selector: '.mermaid' }),
    ).toBeInTheDocument();
  });

  it('keeps data:image URIs in img src', () => {
    const { container } = renderMd('![pic](data:image/png;base64,AAAA)');
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'data:image/png;base64,AAAA',
    );
  });

  it('keeps data:image URIs in raw <img> src', () => {
    const { container } = renderMd(
      '<img src="data:image/png;base64,AAAA" alt="pic" />',
    );
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'data:image/png;base64,AAAA',
    );
  });

  it('still strips unsafe image and link URLs', () => {
    const { container } = renderMd(
      '![a](javascript:alert)\n\n![b](data:text/html;base64,AAAA)\n\n[x](data:text/html;base64,AAAA)',
    );
    const images = container.querySelectorAll('img');
    expect(images[0].getAttribute('src')).toBeFalsy();
    expect(images[1].getAttribute('src')).toBeFalsy();
    expect(container.querySelector('a')?.getAttribute('href')).toBeFalsy();
  });

  it('highlights fenced code with hljs classes', () => {
    const { container } = renderMd('```js\nconst a = 1;\n```');
    expect(container.querySelector('code.hljs')).toBeInTheDocument();
  });
});
