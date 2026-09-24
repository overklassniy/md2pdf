# Contributing to md2pdf

Thanks for your interest in contributing. This document describes how to set
up the project, the conventions this repository follows, and how to get a
change merged.

## Prerequisites

- Node.js >= 22.12
- pnpm 12 via corepack (`corepack enable`, then `corepack pnpm --version`)

## Setup

```bash
git clone https://github.com/overklassniy/md2pdf.git
cd md2pdf
pnpm install
pnpm dev
```

## Development commands

| Command          | Purpose                    |
| ---------------- | -------------------------- |
| `pnpm dev`       | start the dev server       |
| `pnpm build`     | production build           |
| `pnpm preview`   | serve the production build |
| `pnpm test`      | run Vitest                 |
| `pnpm lint`      | ESLint                     |
| `pnpm typecheck` | `tsc --noEmit`             |
| `pnpm format`    | Prettier                   |

## Before submitting a pull request

1. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`. All three must pass.
2. Run `pnpm format` to normalize formatting.
3. Add or update tests for behavior changes.
4. Update the README and any affected directory `README.md` files when the
   change alters documented behavior or adds/removes files.

## Conventions

- **Language.** All code, comments, documentation, issues, and commit messages
  are in English.
- **Commits.** Commit messages follow
  [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):
  `type(scope): description`, imperative mood, under 72 characters. Reference
  related issues with `Refs #N`, `Fixes #N`, or `Closes #N` footers.
- **Comments and docs.** JSDoc for TypeScript/JavaScript. Plain text only:
  no emojis, no decorative Unicode, no pseudographics.
- **Directory READMEs.** Every directory that holds source code or other
  project artifacts has a `README.md` describing its purpose and contents.
  When you create a directory or meaningfully change one, add or update its
  README in the same change.
- **Reuse first.** Before adding a new utility or component, search `src/` for
  an existing implementation and extend it instead of duplicating.

## Reporting bugs and requesting features

Use the issue templates on GitHub. A good bug report includes the Markdown
that triggers the problem, the browser and OS, and console output if the app
crashes. Because md2pdf renders documents entirely in the browser, samples and
screenshots are often the fastest way to a diagnosis.

## Security issues

Do not open a public issue for a vulnerability. See
[SECURITY.md](SECURITY.md) for the reporting process.
