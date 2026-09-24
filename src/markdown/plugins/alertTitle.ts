import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Blockquote, Paragraph, Text } from 'mdast';

/** GitHub-style default titles for each alert type. */
const CANONICAL_TITLES: Record<string, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const QUOTED_MARKER =
  /^\[!(note|tip|important|warning|caution)\s+"([^"]+)"\]/i;
const BARE_MARKER = /^\[!(note|tip|important|warning|caution)\]/i;

/**
 * Remark plugin normalizing alert markers to the legacy `[!TYPE/title]` form
 * consumed by remark-github-blockquote-alert (which must run afterwards with
 * `legacyTitle: true`).
 *
 * Two rewrites happen on the first text node of a blockquote:
 *   > [!NOTE "Custom title"] -> > [!NOTE/Custom title]
 *   > [!CAUTION]             -> > [!CAUTION/Caution]
 *
 * The second case replaces the plugin's ALL-CAPS default titles with the
 * sentence-case titles GitHub displays.
 *
 * @param tree mdast tree to transform in place.
 */
export function remarkAlertTitle() {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node) => {
      const blockquote = node as Blockquote;
      const first = blockquote.children[0] as Paragraph | undefined;
      if (first?.type !== 'paragraph') return;
      const text = first.children[0] as Text | undefined;
      if (text?.type !== 'text') return;

      text.value = text.value
        .replace(
          QUOTED_MARKER,
          (_m, type: string, title: string) => `[!${type.toUpperCase()}/${title}]`,
        )
        .replace(
          BARE_MARKER,
          (_m, type: string) =>
            `[!${type.toUpperCase()}/${CANONICAL_TITLES[type.toLowerCase()]}]`,
        );
    });
  };
}
