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

## CI and releases

Three GitHub Actions workflows live in `.github/workflows/`:

- **ci** — on every push to `master` and every pull request: `pnpm lint`,
  `pnpm typecheck`, `pnpm test`, `pnpm build`, plus a Docker build smoke test.
- **dev-image** — on pushes to `master` that affect image contents: publishes
  `:dev` and `:latest` tags to GHCR and Docker Hub.
- **release** — on `v*` tags: re-runs lint/typecheck/test, then publishes
  `:version`, `:major`, `:major.minor`, and `:latest` tags to GHCR and
  Docker Hub. No GitHub Release object is created; the tag is the release.
- **dockerhub-sync** — on changes to `DOCKERHUB.md`: pushes it to the
  Docker Hub repository overview and sets the short description.

To cut a release:

```bash
git tag v1.2.3
git push origin v1.2.3
```

The runtime image is a scratch container with a single static web server
(`ghcr.io/static-web-server/static-web-server`) — no shell or package
manager, about 5 MB plus the app bundle. There is intentionally no
`HEALTHCHECK` in the image; check health from outside (`curl` the
container, compose `healthcheck`, or your orchestrator). If an in-image
healthcheck or a debug shell is needed, switch the Dockerfile base to the
`:2-alpine` tag (~3 MB larger).

Required repository secrets for Docker Hub publishing (GHCR uses the
automatic `GITHUB_TOKEN`):

| Secret              | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub account name                  |
| `DOCKERHUB_TOKEN`    | Docker Hub access token with write scope |

Optional repository variable: `DOCKERHUB_IMAGE` — overrides the Docker Hub
image name (default `overklassniy/md2pdf`). Without the secrets, pushes to
Docker Hub are skipped and GHCR still works.

## Reporting bugs and requesting features

Use the issue templates on GitHub. A good bug report includes the Markdown
that triggers the problem, the browser and OS, and console output if the app
crashes. Because md2pdf renders documents entirely in the browser, samples and
screenshots are often the fastest way to a diagnosis.

## Security issues

Do not open a public issue for a vulnerability. See
[SECURITY.md](SECURITY.md) for the reporting process.
