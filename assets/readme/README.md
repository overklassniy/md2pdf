# assets/readme/

Visual assets for the root `README.md` and social previews.

## Contents

- `hero.svg` – animated hero banner (SMIL: blinking caret, pulsing conversion
  arrow, print sweep). The first frame is a complete static scene, so the image
  still reads correctly where animation does not run.
- `demo.png` – application screenshot embedded in the root `README.md` as
  product proof: Markdown editor pane next to the live document preview.

## Notes

- Palette: paper `#f6f4ee`, ink `#1b1b1f`, signal red `#d1242f`, muted
  `#57606a`/`#6e747d`/`#a9aeb6`. Do not introduce blue, green, or purple.
- `og-img.png` is rasterized from `public/og-image.svg` with headless Chrome:
  `chrome --headless --screenshot=public/static/og-img.png --window-size=1200,630 public/og-image.svg`
- The favicon (`public/favicon.svg`) shares the same paper/ink/red monogram
  design.
