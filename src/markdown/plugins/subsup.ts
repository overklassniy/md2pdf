import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Parent } from 'unist';
import type { PhrasingContent, Root, Text } from 'mdast';

/**
 * Remark plugin adding Pandoc-style superscript and subscript.
 *
 * Syntax:
 *   ^superscript^ — content must be non-empty and contain no whitespace or `^`;
 *   ~subscript~   — content must be non-empty and contain no whitespace or `~`.
 *
 * The whitespace rule is what keeps ordinary prose safe: `x^2 + y^2` and
 * `~/.config and ~/.bashrc` are left untouched.
 *
 * The pipeline must set remark-gfm `singleTilde: false`, otherwise single
 * tildes are consumed as (non-standard) strikethrough before this plugin runs.
 *
 * Produced nodes carry `data.hName`, so remark-rehype renders them as <sup>
 * and <sub> without custom hast handlers.
 */
export function remarkSubSup() {
  return (tree: Root) => {
    findAndReplace(
      tree,
      [
        [/\^([^\s^]+)\^/g, replaceWith('sup')],
        [/~([^\s~]+)~/g, replaceWith('sub')],
      ],
      {
        // Never rewrite inside links, images or code-like constructs.
        ignore: [
          'link',
          'linkReference',
          'image',
          'imageReference',
          'definition',
        ],
      },
    );
  };
}

/**
 * Builds a replacer that wraps the captured text in a custom inline node.
 *
 * @param tagName hast tag name ('sup' or 'sub').
 * @returns a findAndReplace replacement function.
 */
function replaceWith(tagName: 'sup' | 'sub') {
  return (...args: unknown[]): PhrasingContent => {
    // Signature: (matched, ...captures, match) — the captured content is the
    // first capture group, located before the trailing match object.
    const captured = String(args[1]);
    const node: Parent & { data: { hName: string } } = {
      type: tagName === 'sup' ? 'superscript' : 'subscript',
      children: [{ type: 'text', value: captured } as Text],
      data: { hName: tagName },
    };
    return node as PhrasingContent;
  };
}
