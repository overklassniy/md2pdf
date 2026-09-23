import { useEffect, useRef, useState } from 'react';

let renderSeq = 0;

interface MermaidBlockProps {
  code: string;
}

/**
 * Renders a ```mermaid fenced block as an inline SVG diagram.
 *
 * mermaid (~500 KB) is imported on demand so documents without diagrams do
 * not pay the bundle cost. Render errors are contained to the block — the
 * source is shown with the parser message instead of crashing the preview.
 *
 * @param props.code mermaid diagram source.
 */
export default function MermaidBlock({ code }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'default',
        });
        const { svg } = await mermaid.render(
          `md2pdf-mermaid-${++renderSeq}`,
          code,
        );
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="mermaid mermaid--error">
        <pre>
          <code>{code}</code>
        </pre>
        <p className="mermaid--error-message">{error}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid" />;
}
