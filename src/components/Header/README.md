# src/components/Header/

Top application bar.

## Contents

- `Header.tsx` — layout and wiring: upload, scroll-sync toggle, reset, settings, export.
- `UploadButton.tsx` — `.md` file picker.
- `ExportMenu.tsx` — dropdown with Print/PDF, .md and .html downloads.
- `SettingsPanel.tsx` — page setup dropdown (format, orientation, margins, paged.js options).
- `Dropdown.tsx` — shared dropdown primitive (outside-click and Escape close).
- `Header.module.scss`, `Dropdown.module.scss` — scoped styles.

## Dependencies

Uses `state/context` for text and settings; `export/print.ts` and
`export/exportFile.ts` perform the exports. The GitHub star iframe points to
`overklassniy/md2pdf`.
