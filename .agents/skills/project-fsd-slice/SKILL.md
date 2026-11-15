---
name: project-fsd-slice
description: Добавляет или переносит страницу, маршрут, слайс или сегмент во фронтенде проекта по FSD 2.1 (apps/web/src, слои _app, _pages, widgets, features, entities, shared). Use when creating a page or route, a widget, feature or entity slice, a public API (index.ts, index.server.ts), or moving code between FSD layers in apps/web.
---

# Страница или слайс FSD в apps/web

Слои сверху вниз: `_app`, `_pages`, `widgets`, `features`, `entities`, `shared`. Слой импортирует только слои ниже.

## 1. Выбери место

- Код одной страницы держи в `_pages/<страница>`. Ниже переносим, только когда код понадобился второй странице:
  - крупный самостоятельный блок интерфейса (шапка, боковое меню): `widgets`;
  - действие пользователя с бизнес-смыслом (переименовать доску, поделиться): `features`;
  - понятие предметной области (session, user, workspace, board): `entities`;
  - код без бизнес-смысла: `shared` по сегментам `api`, `ui`, `lib`, `config`, `routes`.
- Провайдеры, раскладки и глобальные стили: `_app`.
- Сомневаешься между слоями: оставь код на странице и спроси в PR.

## 2. Создай слайс

- Папка в kebab-case: `features/rename-board/`.
- Сегменты по назначению:
  - `ui`: компоненты;
  - `model`: стор интерфейса и логика. Схему формы бери из contracts или выводи из неё через `.pick` и `.extend`, свою схему с нуля не пиши;
  - `api`: только то, что нужно одному слайсу (например, мутация с обновлением кэша). Функции запросов и фабрики `queryOptions` по ресурсам лежат в `shared/api`;
  - `lib`, `config`.
- Сегменты `components`, `hooks`, `types`, `helpers` не заводим.
- Публичный API в `index.ts` с явными экспортами:

```ts
// features/rename-board/index.ts
export { RenameBoardButton } from "./ui/rename-board-button";
export { renameBoardMutationOptions } from "./api/rename-board";
```

- `export *` не используй. Внутри слайса импорты относительные, снаружи через `@/<слой>/<слайс>`.
- Слайсы одного слоя друг друга не импортируют. Исключение только на `entities`: кросс-импорт через `@x` (`entities/board/@x/user.ts` отдаёт то, что нужно `entities/user`).
- Загрузчик данных для серверного компонента экспортируй из `index.server.ts`, первой строкой `import 'server-only'`. Из `index.ts` он попал бы в клиентскую сборку.

## 3. Маршрут для новой страницы

- Страница: `src/_pages/<страница>/ui/<страница>-page.tsx` и `src/_pages/<страница>/index.ts`.
- Файл маршрута в `apps/web/app/` ре-экспортирует страницу одной строкой, при необходимости вместе с `metadata`:

```ts
// app/(app)/w/page.tsx
export { WorkspacesPage as default, metadata } from "@/_pages/workspaces";
```

- `metadata` объявляй в файле без `'use client'` (например, `config/metadata.ts` страницы) и отдавай через `index.ts`: клиентская страница `metadata` не экспортирует.

- `loading.tsx`, `error.tsx` и `not-found.tsx` тоже ре-экспортируют компоненты из `_pages`; в `error.tsx` первой строкой `'use client'`. `layout.tsx` берёт раскладку из `@/_app/layouts`.
- Страница с холстом подключает редактор через `next/dynamic` с `ssr: false`, и только в клиентском компоненте (файл с `'use client'`): в серверном компоненте это ошибка сборки.
- Папку `pages/` в корне `apps/web` не создавай даже пустой: хуки `next/navigation` получат типы с `null`.

## 4. Проверь

- Steiger по `apps/web/src` (команда появится с каркасом): нет нарушений `forbidden-imports`, `no-public-api-sidestep`, `insignificant-slice`. Steiger ложно ругается на `import()` в `next/dynamic` через границу слайса: отметь это в PR, правило не отключай.
- Typecheck и тесты затронутого слайса.

Справка: гайд FSD по Next.js https://feature-sliced.design/docs/guides/tech/with-nextjs; раздел 3 в `docs/architecture/frontend.md`.
