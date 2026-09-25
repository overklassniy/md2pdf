# syntax=docker/dockerfile:1
#
# Multi-stage build:
#   build — Node 24 + pnpm install + vite build; produces the static
#           bundle in /app/dist.
#   dist  — ghcr.io/static-web-server/static-web-server (scratch) serves
#           the bundle on port 80.
#
# The OCI labels below are defaults for local builds. The dev-image and
# release workflows override version, revision and created via
# docker/metadata-action labels when pushing to GHCR and Docker Hub.

FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ghcr.io/static-web-server/static-web-server:2 AS dist

ARG IMAGE_VERSION="dev"
ARG VCS_REF=""
ARG BUILD_DATE=""

LABEL org.opencontainers.image.title="md2pdf" \
      org.opencontainers.image.description="Offline Markdown to PDF: edit, preview and print to PDF in the browser" \
      org.opencontainers.image.url="https://github.com/overklassniy/md2pdf" \
      org.opencontainers.image.documentation="https://github.com/overklassniy/md2pdf#readme" \
      org.opencontainers.image.source="https://github.com/overklassniy/md2pdf" \
      org.opencontainers.image.authors="overklassniy" \
      org.opencontainers.image.vendor="overklassniy" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${IMAGE_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.base.name="ghcr.io/static-web-server/static-web-server:2"

ENV SERVER_ROOT=/public
COPY --from=build /app/dist /public

EXPOSE 80
