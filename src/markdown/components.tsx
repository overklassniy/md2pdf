import { isValidElement, type ReactNode } from 'react';
import {
  defaultUrlTransform,
  type Components,
  type UrlTransform,
} from 'react-markdown';
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

/**
 * URL sanitizer for rendered markdown.
 *
 * The default transform strips `data:` URLs to an empty string, which
 * breaks the base64 images that paste/drop embedding produces. Only
 * `img.src` gets the `data:image/` exception — scripts cannot execute
 * through an image element, while `href`, `srcSet` and non-image `data:`
 * payloads (e.g. `data:text/html`) stay sanitized.
 */
export const markdownUrlTransform: UrlTransform = (url, key, node) => {
  if (
    key === 'src' &&
    node.tagName === 'img' &&
    url.startsWith('data:image/')
  ) {
    return url;
  }
  return defaultUrlTransform(url);
};
