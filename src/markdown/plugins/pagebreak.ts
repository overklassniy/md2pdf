import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { Paragraph, Root } from 'mdast';

const PAGEBREAK_PATTERN = /^\\(newpage|pagebreak)$/;

/**
 * Remark plugin turning a standalone `\newpage` or `\pagebreak` paragraph
 * into an explicit page-break element.
 *
 * The marker paragraph is re-tagged as <div class="page-break">; print CSS
 * gives it `break-after: page`, while on screen it renders as a dashed rule.
 */
export function remarkPagebreak() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node) => {
      const paragraph = node as Paragraph;
      if (!PAGEBREAK_PATTERN.test(toString(paragraph).trim())) return;
      paragraph.children = [];
      paragraph.data = {
        hName: 'div',
        hProperties: { className: ['page-break'] },
      };
    });
  };
}
