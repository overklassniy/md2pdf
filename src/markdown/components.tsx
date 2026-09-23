import { isValidElement, type ReactNode } from 'react';
import type { Components } from 'react-markdown';
import MermaidBlock from '../components/Preview/MermaidBlock';

const MERMAID_CLASS = 'language-mermaid';

interface CodeElementProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Extracts plain text out of a <code> element's children.
 *
 * @param children React children of a code element.
 * @returns the concatenated text content.
 */
function codeText(children: ReactNode): string {
  return String(
    Array.isArray(children) ? children.join('') : (children ?? ''),
  ).replace(/\n$/, '');
}

/**
 * Custom element renderers for react-markdown.
 *
 * The `pre` override intercepts mermaid fenced blocks before the default
 * <pre><code> nesting is rendered, replacing them with a rendered diagram.
 * The internal `node` prop is stripped so it never reaches the DOM.
 */
export const markdownComponents: Components = {
  pre({ children, node: _node, ...props }) {
    if (isValidElement<CodeElementProps>(children)) {
      const className = children.props.className ?? '';
      if (className.includes(MERMAID_CLASS)) {
        return <MermaidBlock code={codeText(children.props.children)} />;
      }
    }
    return <pre {...props}>{children}</pre>;
  },
};
