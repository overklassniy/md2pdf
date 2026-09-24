# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ghcr.io/static-web-server/static-web-server:2 AS dist

LABEL org.opencontainers.image.source="https://github.com/overklassniy/md2pdf" \
      org.opencontainers.image.description="Offline Markdown to PDF: edit, preview and print to PDF in the browser" \
      org.opencontainers.image.licenses="MIT"

ENV SERVER_ROOT=/public
COPY --from=build /app/dist /public

EXPOSE 80
