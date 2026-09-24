# src/hooks/

Reusable React hooks.

## Contents

- `useScrollSync.ts` — line-based scroll sync between the CodeMirror scroller and the preview pane using `data-source-line` markers with interpolation between anchors (proportional fallback); a driver lock prevents feedback loops; toggleable from the header.
- `useDrop.ts` — drag-and-drop loading of text files (`.md`, `.markdown`, `.mdown`, `.mkd`, `.txt`) onto a container; other payloads are left for the editor's own drop handling.

## Notes

Editor-specific behavior (image paste/drop) lives in
`components/Editor/imagePaste.ts` because it is a CodeMirror extension, not a
React hook.
