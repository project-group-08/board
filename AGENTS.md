# Правила для ИИ-агентов и людей

Проект: сервис совместной работы на интерактивных досках (бесконечный холст, совместное редактирование в реальном времени, функции ИИ). Правила обязательны для агентов и людей. Факты о коде бери из кода. Если код расходится с этим файлом, не выбирай молча: сообщи и предложи правку в PR.

Причины решений: [docs/architecture/frontend.md](docs/architecture/frontend.md) (текст доски архитектуры) и [docs/adr/](docs/adr/README.md). В пакетах лежат свои AGENTS.md: перед правкой файлов пакета прочитай его.

## Где что лежит

| Путь | Что | Правила |
| --- | --- | --- |
| `apps/web` | Next.js 16, FSD 2.1, shadcn/ui и Tailwind | [apps/web/AGENTS.md](apps/web/AGENTS.md) |
| `apps/api` | NestJS: REST, Socket.IO | [apps/api/AGENTS.md](apps/api/AGENTS.md) |
| `apps/worker` | BullMQ: ИИ, файлы, Telegram (добавим при необходимости) | |
| `packages/contracts` | схемы Zod и типы: DTO, события сокета, элементы доски, ответы ИИ | [packages/contracts/AGENTS.md](packages/contracts/AGENTS.md) |
| `packages/board-doc` | устройство документа доски на Yjs, без DOM | [packages/board-doc/AGENTS.md](packages/board-doc/AGENTS.md) |
| `apeiro` (зависимость `apps/web`) | движок доски: холст на WebGPU/WebGL2, инструменты, отмена, React-обвязка ([ADR-0013](docs/adr/0013-apeiro-board-engine.md)) | |
| `docs/` | архитектура, решения (ADR), памятка про агентов | |

Кто кого импортирует: `contracts` ничего из репозитория; `board-doc` только `contracts`; `apps/web` берёт `apeiro`, `board-doc` и `contracts`; `apps/api` берёт `board-doc` и `contracts`; `apps/worker` берёт `contracts`. Обратных импортов нет. Пакеты называются `@tabula/<папка>` ([ADR-0011](docs/adr/0011-package-scope.md)).

## Команды

Пометка «с каркасом» значит: скрипт, конфиг или пакет появится после пунктов «Сделать с каркасом» в `docs/ai/README.md`. Пока их нет, запускай только то, что уже есть в `package.json`, а что проверить нельзя, перечисли в ответе. Скрипты, конфиги линтеров и CI сам не заводи.

- Только pnpm. Версии задаёт catalog в `pnpm-workspace.yaml`, в `package.json` пакета пиши `"catalog:"`. Новый пакет добавляй в catalog в том же PR и объясни в описании, зачем он. Версию из catalog в задаче не поднимай: это отдельный PR с причиной.
- Настройки pnpm пишем в `pnpm-workspace.yaml`, в `.npmrc` только доступ к реестру. Скрипты установки зависимостей pnpm запускает только у пакетов с `true` в `allowBuilds`. Если скрипты есть у пакета без записи, установка падает с `ERR_PNPM_IGNORED_BUILDS`, а pnpm пишет туда заглушку: замени её тем же PR на `true` или `false` и объясни выбор; `strictDepBuilds` не трогай.
- Инструменты запускай установленные в проекте (`pnpm exec`), не через `npx` и `pnpm dlx`. Исключение: разовые команды установки из «Сделать с каркасом» в `docs/ai/README.md`, и только по прямой просьбе человека.
- Проверка повторяет CI: `oxfmt --check`, затем oxlint, затем Steiger (линтер границ FSD) для `apps/web/src`, затем `next typegen` и `tsc --noEmit`, затем Vitest, затем сборка через Turborepo. Гоняй проверки затронутых пакетов, а не всего репозитория. Точные скрипты впишем с каркасом.
- Vitest запускай разово: `vitest run <путь к файлу>`, без режима watch.
- Вывод долгого прогона сохраняй в файл вне репозитория (во временную папку системы) и читай оттуда, а не перезапускай прогон.
- Полный e2e на Playwright запускай только по просьбе: он долгий.

## Версии и ловушки

- TypeScript 6.0.x, не 7: Nest CLI и `@nestjs/swagger` пока не поддерживают TypeScript 7. Не обновляй TypeScript сам. tsconfig держим совместимым с TypeScript 7 (на нём работает линт с типами в oxlint): без `ignoreDeprecations`. `baseUrl` в TS 6 устарел: алиасы через `paths` или `imports` в package.json, и только в приложениях; внутри `packages/*` импорты относительные: `contracts` и `board-doc` собирает tsc, а он алиасы не переписывает. `types` по умолчанию пустой: глобальные типы (`node`, `vitest/globals`) перечисляй в `compilerOptions.types`.
- Next.js 16: `proxy.ts` вместо `middleware.ts`; `next lint` удалён, и `next build` линтер не запускает: линтер у нас oxlint, отдельной командой; `params` и `searchParams` асинхронные.
- Oxlint: корневой `.oxlintrc.json`, отличия в `overrides`; Oxfmt: корневой `.oxfmtrc.json` ([ADR-0010](docs/adr/0010-root-lint-format-config.md)). ESLint и Prettier не ставим. Версии Oxc точные, обновляем отдельным PR ([ADR-0007](docs/adr/0007-oxlint-oxfmt.md)).
- Zod 4: только API четвёртой версии, `import { z } from 'zod'`.
- Yjs 13.6.x: ветку 14 (ещё не стабильна) не ставь. В репозитории одна копия `yjs`, иначе ломаются проверки instanceof.
- Движок доски Apeiro, версия закреплена в catalog; Konva не ставим ([ADR-0013](docs/adr/0013-apeiro-board-engine.md)). React Compiler не включай: вопрос открыт (см. «Ещё не решено»), в Next 16 он выключен по умолчанию.
- Стили: Tailwind CSS 4 и shadcn/ui. SCSS и CSS Modules не используем. Настройки Tailwind в CSS (`@theme`), файла `tailwind.config.js` нет.
- Node 24 (от 24.15): версия закреплена в `.nvmrc`, тот же Node в CI и Docker.

## Архитектура

1. Типы данных, которыми обмениваются web, api и worker, живут только в `packages/contracts` как схемы Zod; тип выводим через `z.infer`. Такие типы руками не пишем, `shared/types` не заводим. Генерацию типов из Swagger и копии схем в приложениях не заводим: репозиторий один ([ADR-0002](docs/adr/0002-monorepo.md)), бэк проверяет запросы теми же схемами ([ADR-0003](docs/adr/0003-zod-validation-on-backend.md)).
2. Содержимое доски меняется только через движок, транзакцией. Копий документа в TanStack Query, `useState` или Zustand нет.
3. Пять зон состояния: данные сервера (в том числе результаты ИИ и версии) в TanStack Query; документ доски в Y.Doc; камера, выделение, инструмент, редактируемый элемент и статус связи в движке; присутствие (курсоры, кто на доске) в своём сторе вне React; интерфейс (панели, модалки, флаги режимов вроде jobId превью) в Zustand.
4. Присутствие и камера не попадают в Y.Doc: иначе курсоры уйдут в отмену и в версии.
5. `apeiro` импортируется только в `apps/web`; Y.Doc для него создаёт `packages/board-doc` ([ADR-0013](docs/adr/0013-apeiro-board-engine.md)).
6. Движок не знает про роли и рабочие пространства: права получает параметром `readOnly` или ролью из ответа `board:join`. Сокет к нему подключает приложение.
7. Права проверяет бэк в каждом HTTP-запросе и в каждом событии сокета. Проверки на фронте нужны только интерфейсу.
8. Контракты меняем только добавлением; бэк выкатываем раньше фронта.
9. Движение чужого курсора не вызывает ни одной перерисовки React: это критерий приёмки доски.
10. Синхронизация на клиенте: Yjs поверх Socket.IO ([ADR-0005](docs/adr/0005-yjs-sync.md)). Без связи апдейты в сокет не шлём, недостающее уйдёт при синхронизации; после переподключения снова входим на доску и обмениваемся state vector в обе стороны; сервер отклонил апдейт: клиент выбрасывает свой Y.Doc и стек отмены и входит заново.
11. `apps/web` по FSD 2.1: в `app/` только ре-экспорт страниц из `src/_pages`; слой импортирует только слои ниже; чужой слайс только через его `index.ts`; новый код живёт в `_pages/<страница>`, пока не нужен второй странице.

## Ещё не решено

Эти вопросы команда ещё не решила; формулировки и рекомендации в [docs/adr/README.md](docs/adr/README.md). Пока вопрос открыт, работай по рекомендации. Не делай того, что потом трудно отменить: схему базы, формат документа, публичный протокол. Нужен выбор, которого нет в рекомендациях: сам не выбирай, напиши вопрос в ответе или PR и оставь в коде `TODO(решение): <вопрос>`.

- где хранится состояние доски на бэке; лимиты; хранение версий;
- Cache Components в Next 16; React Compiler;
- какие письма шлёт бэк; что значит «базовое форматирование» текста; права наблюдателя; восстановление версии при участниках; кто раскладывает черновик ИИ; загрузка файлов в S3 через бэк или по подписанной ссылке.

## Как работать

- Правь только то, что нужно задаче. Найденное попутно опиши в ответе или PR и предложи завести задачу; в трекер сам не пиши и молча не чини.
- Общие места (`packages/contracts`, `packages/board-doc`, `apps/web/src/shared/ui`) меняй, только если задача без этого не решается, и объясни правку в PR. Контракты меняй по скиллу `project-contracts-change`. Новый компонент shadcn добавлять можно, существующие без задачи не правь. Конфиги линтеров, CI, Docker и хуки Git без отдельной задачи не трогай.
- Блоки между маркерами, которые пишут инструменты (`nextjs-agent-rules` от `next dev`, блок Turborepo), не правь и коммить как есть.
- Не обходи проверки: никаких `--no-verify`, `HUSKY=0`, `oxlint-disable`, `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `as any` и ослабления правил в конфигах. Мешает правило: предложи изменить его отдельным PR.
- Баг: сначала воспроизведи и найди причину, потом чини, одна гипотеза на правку. Три правки подряд не помогли: остановись и опиши, что проверил.
- API библиотек сверяй с документацией установленной версии (раздел «Документация установленных версий»), а не с памятью.
- Задача расходится с ТЗ, архитектурой или ADR: процитируй место и спроси до начала работы.

## Готово, когда

- прогнаны проверки затронутых пакетов, которые уже есть, и в ответе их итог; что проверить нельзя, названо;
- новое поведение покрыто тестом, баг закрыт тестом, который падал до правки;
- нет новых ошибок TypeScript и новых предупреждений oxlint и Steiger, `oxfmt --check` проходит; известное ложное срабатывание Steiger на `import()` в `next/dynamic` отмечено в PR;
- поменялось правило: в том же PR обновлены AGENTS.md или ADR.

## Тесты

- Ядро движка и документа: Vitest без DOM. Рендер и холст: браузерный режим Vitest или Playwright, потому что jsdom canvas не рисует.
- REST подменяем через MSW, сокет через фейковый транспорт за адаптером.
- Внешние сервисы в тестах и при разработке не вызываем: LLM через заглушку провайдера, почта только в Mailpit, Telegram через мок, S3 через локальное хранилище, Sentry без DSN (DSN задаём переменной окружения, не в коде). Живой вызов только по договорённости команды.
- В Vitest включаем `restoreMocks: true` (с каркасом). API `jest.*` не используем, только `vi.*`.

## Git и PR

- Ветки по gitflow ([ADR-0008](docs/adr/0008-gitflow.md)): `main` для прода, `develop` для разработки. Ветка задачи от свежего `develop`: `feature/`, `fix/` или `chore/`, ключ задачи из трекера и пара слов латиницей, например `feature/BOA-12-version-panel`.
- PR из ветки задачи в `develop` с зелёным CI и перекрёстным ревью (смотрит любой участник, не только тимлид); `develop` в `main` через PR, когда версия стабильна. Напрямую в `main` и `develop` не пушим.
- Коммиты по Conventional Commits: тип латиницей, описание на русском, например `feat(web): добавить панель версий`. Область в скобках: `web`, `api`, `contracts`, `board-doc`, `board-engine`, для правил и ADR `docs`. В теле коммита: почему и что изменилось.
- Хук Git перед пушем (с каркасом, его настраивает задача инфраструктуры) запускает линтеры и тесты. Хук упал из-за твоей правки: исправь её, иначе опиши причину в ответе. Хук не обходи.
- Комментарии в коде на русском и про «почему», а не про «что».
- Один небольшой PR на задачу. Агент коммитит законченные шаги в ветку задачи; пушит и открывает PR человек или агент по его прямой просьбе. Force-push делает только человек и только в свою ветку (`--force-with-lease`), в `main`, `develop` и чужие ветки никогда.
- Не коммить `.env*` (кроме `.env.example`), дампы баз, архивы и тяжёлые бинарные файлы.

## Секреты и окружение

- Реальные значения только в локальном `.env` и GitHub Secrets; в репозитории `.env.example`.
- Ключи LLM, S3, Telegram и SMTP есть только в `apps/api` и `apps/worker`, токен Sentry для загрузки карт исходников только в GitHub Secrets. В `NEXT_PUBLIC_*` и в коде `apps/web` их нет.
- Не выводи секреты в чат, логи и аргументы команд. Засветился ключ: сообщи команде, ключ перевыпускаем.
- Агент не деплоит, не пишет на серверы и стенды, не меняет настройки GitHub (защита веток, Secrets, Actions), бакеты, бота и аккаунты LLM.
- Скрипты, которые пишут в базу, запускай только против локальной базы из Docker Compose.

## Документация установленных версий

Знания о библиотеках бери отсюда. У Next.js, React, NestJS, Yjs и Konva страницу документации можно получить в Markdown, добавив к адресу `.md`. Большие файлы (llms-full.txt, у NestJS около 3 МБ) целиком в контекст не загружай: ищи в них нужное место.

- Next.js: `apps/web/node_modules/next/dist/docs/` (есть с Next 16.2); без node_modules: https://nextjs.org/docs/llms.txt
- React: https://react.dev/llms.txt
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview.md (оглавление llms.txt у них большое)
- Zustand: https://zustand.docs.pmnd.rs/llms.txt
- FSD: https://feature-sliced.design/docs/guides/tech/with-nextjs (llms-small.txt около 260 КБ, ищи в нём по словам)
- shadcn/ui: https://ui.shadcn.com/llms.txt
- Zod: https://zod.dev/llms.txt
- NestJS: https://docs.nestjs.com/llms.txt (главы как `https://docs.nestjs.com/<глава>.md`)
- Socket.IO: https://socket.io/docs/v4/ (llms.txt нет)
- Yjs: https://docs.yjs.dev/llms.txt
- Konva: https://konvajs.org/llms.txt
- Vitest: https://vitest.dev/llms.txt
- BullMQ: https://bullmq.io/llms.txt
- Turborepo: `docs/README.md` в установленном пакете `turbo` (с каркасом); без node_modules: https://turborepo.dev/llms.txt

## Скиллы

Процедуры лежат в `.agents/skills/<имя>/SKILL.md`; для Claude Code те же скиллы видны через `.claude/skills/`. В Codex скилл вызывают как `$<имя>`, в Claude Code как `/<имя>`; агент без поддержки скиллов читает SKILL.md как файл. Перед такой задачей открой нужный скилл:

- страница, слайс или сегмент в `apps/web`: `project-fsd-slice`;
- схема или тип в `packages/contracts`: `project-contracts-change`;
- новое событие Socket.IO: `project-socket-event`;
- новый тип элемента доски или инструмент движка: `project-board-element`;
- ревью PR, своего или чужого: `project-review`;
- принято или изменено решение: `project-adr`;
- каркас репозитория (папки и зависимости фронтенда): `project-setup`.

## Код-ревью

Ревью по скиллу `project-review`. Форматирование и то, что ловят oxlint, oxfmt и Steiger, не обсуждай: это проверяет CI.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": true` in the root `turbo.json` or `turbo.jsonc` to opt in; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
