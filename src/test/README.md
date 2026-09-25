# src/test/

Shared vitest setup.

## Contents

- `setup.ts` – jest-dom matchers plus jsdom shims (`matchMedia`, `ResizeObserver`, `scrollTo`) needed by CodeMirror 6 and the print flow.

## Notes

jsdom cannot drive CodeMirror 6, so tests mock `@uiw/react-codemirror` with a
plain textarea (see `src/App.test.tsx`). Mermaid is mocked as well – the real
renderer is browser-only.
