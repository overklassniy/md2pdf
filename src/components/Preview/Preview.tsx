import { forwardRef } from 'react';
import Markdown from 'react-markdown';
import {
  remarkPlugins,
  rehypePlugins,
  remarkRehypeOptions,
} from '../../markdown/pipeline';
import { markdownComponents } from '../../markdown/components';
import 'github-markdown-css/github-markdown-light.css';
import 'remark-github-blockquote-alert/alert.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import '../../styles/markdown.scss';

interface PreviewProps {
  source: string;
}

/**
 * Renders markdown source through the unified pipeline.
 *
 * Kept behind a lazy boundary (see PreviewArea) so the parsing stack —
 * react-markdown, KaTeX, highlight.js — stays out of the initial chunk.
 *
 * @param props.source markdown text to render.
 */
const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ source }, ref) => (
  <div ref={ref} className="preview markdown-body" dir="auto">
    <Markdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      remarkRehypeOptions={remarkRehypeOptions}
      components={markdownComponents}
    >
      {source}
    </Markdown>
  </div>
));

Preview.displayName = 'Preview';

export default Preview;
