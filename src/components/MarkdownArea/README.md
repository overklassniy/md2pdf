# src/components/MarkdownArea/

The split-view working area of the app.

## Contents

- `MarkdownArea.tsx` — hosts the editor, the drag handle and the preview pane; wires `useDrop` (file drop loading) and `useScrollSync`, and owns the resizable split width.

## Dependencies

Composes `Editor/` (editor + drag bar) and `Preview/` (preview pane), reads
document state via `state/context`. Rendered by `App.tsx`.
