# src/components/Editor/

Left-pane markdown editor.

## Contents

- `Editor.tsx` – CodeMirror 6 via `@uiw/react-codemirror`: GFM markdown mode, fenced-code language highlighting, GitHub light theme, line wrapping, cursor tracking.
- `imagePaste.ts` – CodeMirror extension inserting pasted/dropped images as base64 `![](data:…)` so exports stay self-contained; the shared `insertImageFile` helper is also used by `hooks/useDrop` for image drops anywhere on the split view.
- `DragBar.tsx` – vertical resize handle between editor and preview.
- `Editor.module.scss`, `DragBar.module.scss` – scoped styles.

## Dependencies

`@codemirror/lang-markdown`, `@codemirror/language-data`,
`@uiw/codemirror-theme-github`, `@codemirror/view`. Emits the EditorView via
`onViewReady` for scroll sync and reports `Ln:Col` via `onCursorChange`.
