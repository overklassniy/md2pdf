# src/components/MarkdownArea/

The split-view working area of the app.

## Contents

- `MarkdownArea.tsx` – hosts the editor, the drag handle and the preview pane; wires `useDrop` (file drop loading) and `useScrollSync`, and owns the resizable split. Below the `COMPACT_QUERY` breakpoint (767.98px) the panes stack vertically (editor over preview) and the divider drags along Y; the split is tracked as a clamped ratio so it survives rotation and resize.

## Dependencies

Composes `Editor/` (editor + drag bar) and `Preview/` (preview pane), reads
document state via `state/context`. Rendered by `App.tsx`.
