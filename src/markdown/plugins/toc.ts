import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Heading, List, ListItem, Paragraph, RootContent } from 'mdast';

/** Maximum heading depth included in the generated table of contents. */
const MAX_TOC_DEPTH = 3;

const TOC_PATTERN = /^\[+\s*toc(?:\s+"([^"]*)")?\s*\]+$/i;

/** Title rendered above the generated list when none is specified. */
const DEFAULT_TITLE = 'Contents';

interface MutableParent extends Parent {
  children: RootContent[];
}

/**
 * Remark plugin replacing a `[TOC]` paragraph with a linked table of
 * contents built from the document headings.
 *
 * An optional quoted title overrides the default "Contents" caption:
 * `[TOC "My title"]`.
 *
 * The generated structure is a <nav class="inline-toc"> containing a title
 * and a nested list of anchor links. Slugs come from github-slugger, which
 * matches the ids produced by rehype-slug later in the pipeline.
 */
export function remarkInlineToc() {
  return (tree: Node) => {
    const slugger = new GithubSlugger();
    const headings: Array<{ depth: number; text: string; slug: string }> = [];

    visit(tree, 'heading', (node) => {
      const heading = node as Heading;
      if (heading.depth > MAX_TOC_DEPTH) return;
      const text = toString(heading).trim();
      if (!text) return;
      headings.push({ depth: heading.depth, text, slug: slugger.slug(text) });
    });

    if (headings.length === 0) return;

    visit(tree, 'paragraph', (node, index, parent) => {
      if (index === undefined || !parent) return;
      const paragraph = node as Paragraph;
      if (paragraph.children.length !== 1) return;
      const only = paragraph.children[0];
      if (only.type !== 'text') return;
      const match = TOC_PATTERN.exec(only.value.trim());
      if (!match) return;

      (parent as MutableParent).children[index] = buildTocNode(
        headings,
        match[1]?.trim() || DEFAULT_TITLE,
      );
    });
  };
}

/**
 * Builds the TOC container node from collected headings.
 *
 * @param headings flattened heading list in document order.
 * @param title caption rendered above the list.
 * @returns a node rendered as <nav class="inline-toc">…</nav>.
 */
function buildTocNode(
  headings: Array<{ depth: number; text: string; slug: string }>,
  title: string,
): RootContent {
  const minDepth = Math.min(...headings.map((h) => h.depth));

  const root: List = { type: 'list', ordered: false, children: [] };
  // Stack of (list, depth) pairs tracking the current nesting level.
  const stack: Array<{ depth: number; list: List }> = [
    { depth: minDepth, list: root },
  ];

  for (const heading of headings) {
    while (stack.length > 1 && heading.depth < stack[stack.length - 1].depth) {
      stack.pop();
    }
    while (heading.depth > stack[stack.length - 1].depth) {
      // Attach a deeper list under the last item of the current list.
      const current = stack[stack.length - 1].list;
      let lastItem = current.children[current.children.length - 1] as
        ListItem | undefined;
      if (!lastItem) {
        lastItem = { type: 'listItem', children: [] };
        current.children.push(lastItem);
      }
      const nested: List = { type: 'list', ordered: false, children: [] };
      lastItem.children.push(nested);
      stack.push({ depth: stack[stack.length - 1].depth + 1, list: nested });
    }

    const item: ListItem = {
      type: 'listItem',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: `#${heading.slug}`,
              children: [{ type: 'text', value: heading.text }],
            },
          ],
        } as Paragraph,
      ],
    };
    stack[stack.length - 1].list.children.push(item);
  }

  const titleNode = {
    type: 'paragraph',
    children: [{ type: 'text', value: title }],
    data: { hName: 'p', hProperties: { className: ['inline-toc__title'] } },
  } as unknown as RootContent;

  return {
    type: 'container',
    children: [titleNode, root as RootContent],
    data: { hName: 'nav', hProperties: { className: ['inline-toc'] } },
  } as unknown as RootContent;
}
