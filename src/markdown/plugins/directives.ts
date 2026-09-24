import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';

interface DirectiveData {
  hName?: string;
  hProperties?: Record<string, unknown>;
  directiveLabel?: boolean;
  [key: string]: unknown;
}

interface DirectiveNode extends Parent {
  name: string;
  attributes?: Record<string, string>;
  data?: DirectiveData;
}

const DIRECTIVE_TYPES = new Set([
  'containerDirective',
  'leafDirective',
  'inlineDirective',
]);

function isDirective(node: Node): node is DirectiveNode {
  return DIRECTIVE_TYPES.has(node.type);
}

/**
 * Remark plugin mapping remark-directive nodes onto HTML elements.
 *
 * Supported directives:
 *   :::note|tip|important|warning|caution — callout block, optional custom
 *     title via the directive label (`:::note[Custom title]`).
 *   :::pagebreak or ::pagebreak — explicit PDF page break.
 *   Any other :::name — generic <div class="directive directive--name">.
 *
 * @param tree mdast tree to transform in place.
 */
export function remarkDirectives() {
  return (tree: Node) => {
    visit(tree, isDirective, (node) => {
      const name = node.name.toLowerCase();
      const data: DirectiveData = (node.data ??= {});

      if (name === 'pagebreak' || name === 'pb') {
        data.hName = 'div';
        data.hProperties = { className: ['page-break'] };
        node.children = [];
        return;
      }

      data.hName = 'div';
      data.hProperties = {
        className: ['directive', `directive--${name}`],
      };
      if (node.type !== 'inlineDirective') {
        promoteLabel(node, 'p', 'directive-title');
      }
    });
  };
}

/**
 * Converts the directive label child into a dedicated element.
 *
 * remark-directive marks the label as a paragraph child carrying
 * data.directiveLabel; re-tagging it makes it a titled paragraph (callouts).
 *
 * @param node directive whose label should be promoted.
 * @param hName hast tag name for the label element.
 * @param className CSS class applied to the label element.
 */
function promoteLabel(node: DirectiveNode, hName: string, className: string) {
  const label = node.children.find(
    (child) =>
      child.type === 'paragraph' &&
      (child.data as DirectiveData | undefined)?.directiveLabel === true,
  );
  if (!label) return;
  label.data ??= {};
  const labelData = label.data as DirectiveData;
  labelData.hName = hName;
  labelData.hProperties = { className: [className] };
}
