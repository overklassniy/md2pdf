# src/state/

Shared application state.

## Contents

- `context.ts` — `AppContext` and the `useApp()` hook (typed access to text, page settings, UI toggles, `resetDocument`).
- `store.tsx` — `AppProvider`: state owner; persists `{ text, settings }` to localStorage with a 300 ms debounce.
- `persistence.ts` — `md2pdf:v1` localStorage load/save helpers (fail-safe).
- `persistence.test.ts` — round-trip and corruption tests.

## Notes

Persistence makes the old `beforeunload` warning unnecessary — a refresh
restores the draft. First launch (or Reset) loads `sample.ts`.
