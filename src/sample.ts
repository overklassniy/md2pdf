/**
 * Default document shown on first launch and restored by the Reset button.
 * Doubles as a living demo of every supported Markdown extension.
 */
export const SAMPLE_DOCUMENT = `---
title: md2pdf feature tour
---

# md2pdf

Awesome **Markdown to PDF**, fully offline. This document is a live demo of the supported syntax — edit anything on the left and watch the preview update.

[TOC]

## How to use

1. Click **Choose** (or drag a \`.md\` file anywhere) to load a document.
2. Edit in the editor on the left.
3. Click **Export** to print to PDF or download HTML/Markdown.
4. In the print dialog pick **Save as PDF**. Chrome is recommended.

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

:::details[Click to expand]
Collapsible content produced by \`:::details\`.
:::

## Raw HTML

You can still use <span style="color:#0984e3">inline HTML</span> when you need it.

<blockquote>Hey, I'm in a blockquote!</blockquote>

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
