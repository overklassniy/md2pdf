# src/components/StatusBar/

Bottom status bar.

## Contents

- `StatusBar.tsx` — word, character and line counts from the current document plus the editor cursor position (`Ln:Col`).
- `StatusBar.module.scss` — scoped styles.

## Dependencies

Reads the document text via `state/context`; receives the cursor position as
a prop from `App`.
