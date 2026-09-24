import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

/** Tags that act as scroll-sync anchors in the rendered preview. */
const BLOCK_TAGS = new Set([
  'blockquote',
  'details',
  'div',
  'dl',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'ul',
]);

interface HastElementLike extends Node {
  tagName?: string;
  properties?: Record<string, unknown>;
}

/**
 * Rehype plugin stamping `data-source-line` on block-level elements.
 *
 * mdast-util-to-hast copies `position` onto generated elements, so the
 * original markdown line is available here; scroll sync uses these markers
 * to map editor lines to preview offsets.
 *
 * @param tree hast tree to transform in place.
 */
export function rehypeSourceLine() {
  return (tree: Node) => {
    visit(tree, 'element', (node) => {
      const el = node as HastElementLike;
      if (!el.tagName || !BLOCK_TAGS.has(el.tagName)) return;
      const line = el.position?.start.line;
      if (line === undefined) return;
      (el.properties ??= {}).dataSourceLine = String(line);
    });
  };
}
