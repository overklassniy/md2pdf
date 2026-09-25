# src/components/

UI components for the app shell.

## Contents

- `MarkdownArea/` – split view: editor, drag handle, preview; wires `useDrop` (file loading) and `useScrollSync`.
- `Header/` – top bar: branding, file upload, export menu, page setup panel, reset, scroll-sync toggle.
- `Editor/` – CodeMirror 6 editor, drag bar, image paste/drop extension.
- `Preview/` – lazy-loaded markdown preview, mermaid block, error boundary, loading indicator.
- `StatusBar/` – word/character/line counts and cursor position.

## Dependencies

Components read document state through `state/context` (`useApp`) and call
`export/print.ts` + `export/exportFile.ts` for export actions. No component
writes to the DOM outside its own subtree except the print flow, which fills
`#print-root`.
