# src/components/Preview/

Right-pane rendered document.

## Contents

- `PreviewArea.tsx` — scrollable wrapper; lazy-loads `Preview` behind `Suspense` and an `ErrorBoundary`.
- `Preview.tsx` — the react-markdown renderer; imports the plugin pipeline and all preview CSS (github-markdown, alert, highlight.js, KaTeX, local overrides).
- `MermaidBlock.tsx` — ` ```mermaid ` fences rendered to SVG via on-demand `import('mermaid')`; errors are contained per block.
- `ErrorBoundary.tsx` — contains render failures so a broken document cannot crash the editor.
- `Loading.tsx` — suspense placeholder.
- `PreviewArea.module.scss`, `Loading.module.scss` — scoped styles.

## Dependencies

`markdown/pipeline.ts` and `markdown/components.tsx` define the whole
rendering contract. The element with class `.preview` inside the wrapper is
what the print/export code reads.
