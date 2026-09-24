# src/components/Header/

Top application bar.

## Contents

- `Header.tsx` — layout and wiring: upload, scroll-sync toggle, reset, settings, export.
- `UploadButton.tsx` — `.md` file picker.
- `ExportMenu.tsx` — direct Print / Save as PDF button plus a Download dropdown (.md, .html).
- `SettingsPanel.tsx` — page setup dropdown (format, orientation, margins, paged.js options).
- `Dropdown.tsx` — shared dropdown primitive; panel is portaled to `document.body` (the header's `overflow: auto` would clip it) and closes on outside click, Escape, scroll or resize.
- `Header.module.scss`, `Dropdown.module.scss` — scoped styles.

## Dependencies

Uses `state/context` for text and settings; `export/print.ts` and
`export/exportFile.ts` perform the exports. The GitHub star iframe points to
`overklassniy/md2pdf`.
