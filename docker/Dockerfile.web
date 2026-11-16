FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages packages

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @tabula/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@tabula/web", "start"]