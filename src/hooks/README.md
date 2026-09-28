# src/hooks/

Reusable React hooks.

## Contents

- `useScrollSync.ts` – line-based scroll sync between the CodeMirror scroller and the preview pane using `data-source-line` markers with interpolation between anchors (proportional fallback); a driver lock prevents feedback loops; toggleable from the header.
- `useDrop.ts` – drag-and-drop file handling on a container: text files (`.md`, `.markdown`, `.mdown`, `.mkd`, `.txt`) load into the document, image files are forwarded to `onImage` for base64 insertion at the drop position, and any other file drop is cancelled so the browser does not navigate to the file.
- `useMediaQuery.ts` – `useSyncExternalStore`-based media query subscription; exports `COMPACT_QUERY`, the shared breakpoint that switches the split view to stacked mode.
- `useVisualViewport.ts` – pins the app height to `visualViewport.height` via the `--app-height` CSS variable so iOS Safari keeps the layout inside the visible area when the on-screen keyboard opens.
- `useMediaQuery.test.ts` – match media subscription tests.

## Notes

Editor-specific behavior (image paste/drop) lives in
`components/Editor/imagePaste.ts` because it is a CodeMirror extension, not a
React hook.
