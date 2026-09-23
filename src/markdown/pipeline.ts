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

/**
 * Remark (markdown → mdast) plugin chain.
 *
 * Order matters:
 * - front matter is stripped first so it never reaches rendering;
 * - gfm uses singleTilde: false so ~sub~ stays available for remarkSubSup
 *   (~~strikethrough~~ is unaffected);
 * - directive parsing (remark-directive) must precede the node mapping done
 *   by remarkDirectives;
 * - smartypants runs last because it rewrites remaining text nodes.
 */
export const remarkPlugins: PluggableList = [
  [remarkFrontmatter, ['yaml']],
  [remarkGfm, { singleTilde: false }],
  remarkMath,
  remarkAlert,
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
        className: 'anchor',
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
];

/**
 * Extra mdast → hast handlers for node types the default converter does not
 * know — currently only definition lists.
 */
export const remarkRehypeOptions = {
  handlers: { ...defListHastHandlers },
};
