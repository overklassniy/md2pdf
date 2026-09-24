import type { PluggableList } from 'unified';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { remarkAlert } from 'remark-github-blockquote-alert';
import remarkDirective from 'remark-directive';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import remarkGemoji from 'remark-gemoji';
import remarkDefinitionList, {
  defListHastHandlers,
} from 'remark-definition-list';
import remarkSmartypants from 'remark-smartypants';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkDirectives } from './plugins/directives';
import { remarkSubSup } from './plugins/subsup';
import { remarkInlineToc } from './plugins/toc';
import { remarkPagebreak } from './plugins/pagebreak';
import { remarkAlertTitle } from './plugins/alertTitle';
import { rehypeSourceLine } from './plugins/sourceline';

/**
 * Remark (markdown → mdast) plugin chain.
 *
 * Order matters:
 * - front matter is stripped first so it never reaches rendering;
 * - gfm uses singleTilde: false so ~sub~ stays available for remarkSubSup
 *   (~~strikethrough~~ is unaffected);
 * - directive parsing (remark-directive) must precede the node mapping done
 *   by remarkDirectives;
 * - remarkAlertTitle rewrites alert markers to the legacy title form, so it
 *   must run before remarkAlert, which is configured with legacyTitle to
 *   accept the generated `[!TYPE/title]` markers;
 * - smartypants runs last because it rewrites remaining text nodes.
 */
export const remarkPlugins: PluggableList = [
  [remarkFrontmatter, ['yaml']],
  [remarkGfm, { singleTilde: false }],
  remarkMath,
  remarkAlertTitle,
  [remarkAlert, { legacyTitle: true }],
  remarkDirective,
  remarkDirectives,
  remarkFlexibleMarkers,
  remarkSubSup,
  remarkGemoji,
  remarkDefinitionList,
  remarkInlineToc,
  remarkPagebreak,
  remarkSmartypants,
];

/**
 * Rehype (hast → React) plugin chain.
 *
 * rehype-raw runs first so inline HTML becomes real elements that later
 * plugins can see; rehype-katex must run before rehype-highlight so math
 * markup is already expanded when highlighting walks code blocks.
 */
export const rehypePlugins: PluggableList = [
  rehypeRaw,
  rehypeKatex,
  [rehypeHighlight, { detect: false, ignoreMissing: true }],
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      properties: {
        // Not 'anchor': github-markdown-css floats .anchor left with a
        // negative margin, which indents the heading. 'no-print' drops the
        // link from printed output.
        className: ['heading-anchor', 'no-print'],
        ariaLabel: 'Link to this heading',
      },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: 'anchor-icon', ariaHidden: 'true' },
        children: [{ type: 'text', value: '#' }],
      },
    },
  ],
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
  rehypeSourceLine,
];

/**
 * Content of the footnote backreference link.
 *
 * The default `↩` glyph renders as an emoji on some platforms; an inline SVG
 * keeps the appearance consistent. Rereferenced definitions keep the GitHub
 * superscript counter after the icon.
 *
 * @param _referenceIndex index of the footnote definition, 0-based.
 * @param rereferenceIndex which call to the same definition this is, 1-based.
 * @returns hast children for the backreference anchor.
 */
function footnoteBackContent(_referenceIndex: number, rereferenceIndex: number) {
  const icon = {
    type: 'element' as const,
    tagName: 'svg',
    properties: {
      className: ['footnote-back-icon'],
      viewBox: '0 0 16 16',
      width: '14',
      height: '14',
      ariaHidden: 'true',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '1.8',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    children: [
      {
        type: 'element' as const,
        tagName: 'path',
        properties: { d: 'M6.5 3.5 3 7l3.5 3.5' },
        children: [],
      },
      {
        type: 'element' as const,
        tagName: 'path',
        properties: { d: 'M3 7h7a3 3 0 0 1 3 3v2' },
        children: [],
      },
    ],
  };

  if (rereferenceIndex <= 1) return [icon];

  const counter = {
    type: 'element' as const,
    tagName: 'sup',
    properties: {},
    children: [{ type: 'text' as const, value: String(rereferenceIndex) }],
  };

  return [icon, counter];
}

/**
 * Extra mdast → hast options: handlers for node types the default converter
 * does not know (definition lists), and a custom footnote backref icon.
 */
export const remarkRehypeOptions = {
  handlers: { ...defListHastHandlers },
  footnoteBackContent,
};
