# src/components/Header/

Top application bar.

## Contents

- `Header.tsx` – layout and wiring: upload, scroll-sync toggle, reset, settings, export.
- `UploadButton.tsx` – `.md` file picker.
- `ExportMenu.tsx` – direct Print / Save as PDF button plus a Download dropdown (.md, .html).
- `SettingsPanel.tsx` – page setup dropdown (format, orientation, margins, paged.js options).
- `Dropdown.tsx` – shared dropdown primitive; panel is portaled to `document.body` (the header's `overflow: auto` would clip it), position-clamped so it cannot slide off narrow viewports, and closes on outside click, Escape, scroll or resize.
- `Toast.tsx` – portaled, auto-dismissing notification used for mobile print hints and the no-print fallback message.
- `Header.module.scss`, `Dropdown.module.scss`, `Toast.module.scss` – scoped styles; coarse-pointer media queries enlarge tap targets, and the GitHub star iframe hides under 400px.

## Dependencies

Uses `state/context` for text and settings; `export/print.ts` and
`export/exportFile.ts` perform the exports. The GitHub star iframe points to
`overklassniy/md2pdf`.
