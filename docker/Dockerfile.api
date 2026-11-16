FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @tabula/api build

EXPOSE 4000
CMD ["pnpm", "--filter", "@tabula/api", "start"]