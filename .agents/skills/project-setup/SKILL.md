---
name: project-setup
description: Создаёт каркас репозитория проекта одной командой: структуру папок по архитектуре (apps/web со слоями FSD, apps/api с модулями, packages/contracts, board-doc, board-engine), package.json пакетов, catalog версий в pnpm-workspace.yaml и зависимости фронтенда (Next.js 16) и бэкенда (NestJS 12, Prisma 7). Use when asked to create the repository skeleton or folder structure, install Next.js or frontend dependencies, or bootstrap a fresh project repository.
---

# Каркас репозитория

Всё делает скрипт `scripts/scaffold.mjs` рядом с этим файлом: создаёт папки, `package.json` и `pnpm-workspace.yaml`, подбирает версии в реестре npm и ставит зависимости. Существующие файлы он не перезаписывает, повторный запуск безопасен. Код приложения (страницы, конфиги Next, компоненты) скрипт не пишет.

## Порядок

1. Убедись, что репозиторий новый: в корне нет `package.json`, или человек явно попросил дополнить каркас. Работай в ветке задачи.
2. Запусти из корня репозитория: `node .agents/skills/project-setup/scripts/scaffold.mjs`. Нужны Node.js 24 (не ниже 24.15) и pnpm 12 и новее. Если их нет, скрипт скажет, что поставить: системные программы сам не ставь, сообщи человеку.
3. Установка упала с `ERR_PNPM_IGNORED_BUILDS`: pnpm дописал в `allowBuilds` (файл `pnpm-workspace.yaml`) пакеты со скриптами установки. Поставь `true` пакетам, которым скрипт нужен для работы (нативные модули, например esbuild и sharp), остальным `false`; сомневаешься, спроси человека. Затем `pnpm install`.
4. pnpm может дописать в `pnpm-workspace.yaml` список `minimumReleaseAgeExclude` для версий, вышедших совсем недавно: это его защита от свежих публикаций, файл коммить как есть. Предупреждение pnpm `unmet peer typescript` у `tsconfck` (зависимость Steiger, ждёт TypeScript 5) ожидаемо: в проекте TypeScript 6.0 по архитектуре. Так же ожидаемо предупреждение о двух устаревших вложенных пакетах: `tsconfck` (из Steiger) и `node-abort-controller` (из BullMQ). Другие предупреждения о peer-зависимостях покажи человеку.
5. Проверь: `pnpm -r list --depth -1` показывает шесть пакетов (корень, `@tabula/web`, `@tabula/api`, `@tabula/contracts`, `@tabula/board-doc`, `@tabula/board-engine`), а `git status` показывает новые папки, `package.json`, `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore` и `pnpm-lock.yaml`.
6. Закоммить всё одним коммитом `chore: каркас монорепо и зависимости фронтенда и бэкенда`, вместе с `pnpm-lock.yaml`.

## Что создаётся

- Папки как на доске архитектуры: `apps/web/app` с папками маршрутов, `apps/web/src` со слоями FSD и слайсами, `apps/api/src/modules` (модули по ресурсам REST из `contracts`), `apps/api/prisma`, `packages/contracts/src` (`common`, `http`, `ws`, `board`, `ai`), `packages/board-doc/src`, `packages/board-engine/src` (12 модулей движка). В пустые папки кладётся `.gitkeep`.
- `package.json` корня (pnpm, Node, oxlint, oxfmt, TypeScript) и пакетов `@tabula/web`, `@tabula/contracts`, `@tabula/board-doc`, `@tabula/board-engine`. Версии только в catalog, в `package.json` стоит `catalog:`.
- Зависимости фронтенда: Next.js 16, React 19, TanStack Query 5, Zustand 5, Zod 4, React Hook Form, socket.io-client 4, Yjs 13.6 (одна копия на репозиторий), Tailwind CSS 4, TypeScript 6.0; инструменты: oxlint, oxfmt, Steiger, Vitest, Testing Library, jsdom, MSW. Konva подключается отдельно при реализации рендера движка.
- Зависимости бэкенда: NestJS 12 (ядро, Socket.IO, Swagger, конфиг, BullMQ, тестирование, CLI), BullMQ 6, Prisma 7 и клиент Prisma той же версии.
- `.nvmrc` с текущей версией Node и стандартные строки в `.gitignore`.

## Чего скрипт не делает

- Не пишет код и конфиги: `next.config`, `tsconfig`, раскладки и страницы, конфиги линтеров. Это пункты «Сделать с каркасом» в `docs/ai/README.md`.
- Не пишет код бэкенда и схему Prisma и не ставит Storybook, Sentry и Playwright: их подключают отдельно. Docker-окружение, Makefile и хук Git делает задача инфраструктуры.
- Не требует Docker: установка идёт без него. Для запуска бэка нужны Postgres и Redis из Docker Compose.

## Нельзя

- Перезаписывать существующие `package.json`, `pnpm-workspace.yaml` и `.nvmrc`.
- Менять мажорные версии из catalog (Next.js 16, React 19, TypeScript 6.0, Yjs 13.6, Konva 10, NestJS 12, Prisma 7) и ставить зависимости мимо catalog.
- Добавлять `konva` куда-то, кроме `packages/board-engine`, и вторую версию `yjs`.
