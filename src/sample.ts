/**
 * Default document shown on first launch and restored by the Reset button.
 * Doubles as a living demo of every supported Markdown extension.
 */
export const SAMPLE_DOCUMENT = `---
title: md2pdf feature tour
---

# md2pdf

Awesome **Markdown to PDF**, fully offline. This document is a live demo of the supported syntax — edit anything on the left and watch the preview update.

[TOC "In this document"]

## How to use

1. Click **Choose** (or drag a \`.md\` file anywhere) to load a document.
2. Edit in the editor on the left.
3. Click **Export** to print to PDF or download HTML/Markdown.
4. In the print dialog pick **Save as PDF**. Chrome is recommended.

The YAML front matter above sets the document \`title\`, which becomes the PDF title and the downloaded file name.

## GitHub Flavored Markdown

| Feature | Supported |
| ------- | --------- |
| Tables  | yes       |
| Tasks   | yes       |
| Math    | yes       |

- [x] Tables, task lists, ~~strikethrough~~
- [x] Autolinks like https://github.com/overklassniy/md2pdf
- [ ] Your own document

Footnotes work too — like this one.[^1]

[^1]: Rendered at the bottom of the document, GitHub style.

## Alerts

> [!NOTE]
> Highlights information that readers should not skim past.

> [!WARNING]
> Critical content demanding immediate attention.

> [!CAUTION "Careful here"]
> A quoted string after the marker sets a custom alert title.

## Math (KaTeX)

Inline math like $E = mc^2$, and display math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Diagrams (Mermaid)

\`\`\`mermaid
flowchart LR
    A[Markdown] --> B[Preview]
    B --> C{Export}
    C -->|Print| D[PDF]
    C -->|Download| E[HTML]
\`\`\`

## Extended syntax

==Highlighted text==, H~2~O, E = mc^2^, and emoji :rocket: :tada:

Term
: Definition lists work as well.

## Directives

:::note
A \`:::note\` container rendered as a callout block.
:::

:::tip[Custom title]
Labels in square brackets set the callout title.
:::

## Raw HTML

You can still use <span style="color:#0984e3">inline HTML</span> when you need it.

<blockquote>Hey, I'm in a blockquote!</blockquote>

## Images

Paste an image from the clipboard (Ctrl+V) or drop an image file anywhere — it is embedded as a base64 data URI, so the exported PDF and HTML stay self-contained and work offline. The usual \`![alt](src)\` syntax works too, and inline \`<img>\` lets you set a size:

![md2pdf badge](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTYiIGZpbGw9IiNkMTI0MmYiLz48dGV4dCB4PSI0OCIgeT0iNjAiIGZvbnQtc2l6ZT0iMzYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5tZDwvdGV4dD48L3N2Zz4=)

<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTYiIGZpbGw9IiNkMTI0MmYiLz48dGV4dCB4PSI0OCIgeT0iNjAiIGZvbnQtc2l6ZT0iMzYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5tZDwvdGV4dD48L3N2Zz4=" width="48" alt="md2pdf badge" />

Remote URLs (\`![alt](https://…)\`) render as well, but need a network connection — the app itself runs fully offline.

## Page breaks

The paragraph after this section starts on a fresh PDF page.

\\newpage

## Code

\`\`\`javascript
// index.js
function hello() {
  console.log('World!');
}
hello();
\`\`\`

---

*Made with md2pdf — print me!*
`;
