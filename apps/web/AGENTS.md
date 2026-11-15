# apps/web: фронтенд

Next.js 16, FSD 2.1. Общие правила: [AGENTS.md](../../AGENTS.md).

## Раскладка

- `app/` лежит в корне `apps/web`: только маршруты Next. Файл маршрута ре-экспортирует страницу и, если нужно, её `metadata` или `generateMetadata`: `export { WorkspacesPage as default, metadata } from '@/_pages/workspaces'`. `metadata` объявляй в файле без `'use client'`: клиентская страница её не экспортирует. Логики, хуков и запросов в `app/` нет. Настройки сегмента (`dynamic`, `revalidate`) не заводи, пока не проверим их ре-экспорт на каркасе.
- `layout.tsx` берёт раскладку из `@/_app/layouts`. В `error.tsx` первая строка `'use client'`.
- В `next.config` стоит `output: 'standalone'`: из него собирается Docker-образ, папки `public` и `.next/static` копирует Dockerfile. Не убирай.
- `proxy.ts` в корне `apps/web` делает только мягкий редирект на `/login` с возвратом, если нет refresh-cookie. Это не проверка прав.
- В `src/` только слои FSD сверху вниз: `_app`, `_pages`, `widgets`, `features`, `entities`, `shared`.

## Слои и импорты

- Слой импортирует только слои ниже. Слайсы одного слоя друг друга не импортируют; исключение: кросс-импорт через `@x`, и только на слое `entities`.
- Из чужого слайса импортируй только его публичный API (`index.ts`). Внутри слайса импорты относительные, между слайсами через алиас `@/`.

```ts
// так
import { BoardCard } from '@/entities/board'
// не так: обход публичного API
import { BoardCard } from '@/entities/board/ui/board-card'
```

- `index.ts` перечисляет экспорты явно, без `export *`.
- Код только для сервера (загрузчики данных для серверных компонентов) экспортируй из `index.server.ts`, первой строкой `import 'server-only'`. Из `index.ts` он попал бы в клиентскую сборку.
- Сегменты слайса: `ui`, `model`, `api`, `lib`, `config`; в `shared` ещё `routes`. Не заводим сегменты `components`, `hooks`, `types`, `helpers`, слой `processes` и папку `shared/types`.
- Начинаем со страницы: код живёт в `_pages/<страница>`, пока он не понадобится второй странице. Тогда переносим ниже: крупный блок в `widgets`, действие пользователя в `features`, понятие предметной области в `entities`.
- Файлы и папки называем в kebab-case: `board-page.tsx`, `features/rename-board/`.
- Страницу, слайс или сегмент добавляй по скиллу `project-fsd-slice`.

## Рендеринг и данные

- Доска `/b/[boardId]` работает только на клиенте. `next/dynamic` с `ssr: false` вызывай в клиентском компоненте внутри `_pages/board` (файл с первой строкой `'use client'`, например `ui/board-client.tsx`): в серверном компоненте `ssr: false` даёт ошибку сборки.
- Остальные страницы: серверная оболочка, данные на клиенте через TanStack Query. Серверный префетч в первой версии не делаем.
- Функции запросов и фабрики `queryOptions` лежат в `shared/api`, по файлу на ресурс; типы из contracts. События сокета обновляют кэш через `invalidateQueries` или `setQueryData`.
- QueryClient: на сервере новый на каждый запрос, в браузере один на приложение (паттерн `getQueryClient` из документации TanStack Query).
- Zustand только для состояния интерфейса. Стор создаём через контекст (на запрос или на доску), а не глобальным модулем: при серверном рендеринге глобальный стор был бы общим для всех запросов.
- Формы: React Hook Form и `zodResolver` со схемой из contracts (или выведенной из неё через `.pick` и `.extend`); вместо `watch()` используй `useWatch`.
- Сессия в httpOnly cookie: токены в JavaScript не читаем и не храним. Одна функция refresh на вкладку: её вызывают HTTP-клиент на 401 и сокет на `connect_error` с unauthorized (после неё `socket.connect()`). Между вкладками refresh идёт под `navigator.locks`, иначе два refresh при ротации погасят друг друга.
- Сокет один на вкладку и создаётся только на клиенте.
- API и сокет на том же домене, что и сайт ([ADR-0004](../../docs/adr/0004-single-domain-caddy.md)): из браузера запросы идут на относительный путь `/api`, сокет создаём через `io()` без адреса сервера. CORS и `credentials: 'include'` не нужны. Пути `/api` и `/socket.io` забирает Caddy: Route Handlers Next под ними не заводим.
- На документ доски и состояние редактора подписывайся через `useSyncExternalStore` и селекторы по id. Из стора присутствия React читает только медленные данные: кто на доске, кто что редактирует. Координаты чужих курсоров и тащимых элементов рисует слой курсоров движка, не React. В `useState` это состояние не копируй.

## UI

- Компоненты shadcn/ui лежат в `src/shared/ui` по файлу на компонент (`shared/ui/button.tsx`), общего `index.ts` там нет. Утилиты в `src/shared/lib`.
- Сначала ищи готовый компонент shadcn, потом пиши свой.
- Стили только классами Tailwind CSS 4: семантические цвета темы (`bg-primary`, `text-muted-foreground`), без сырых hex; отступы между элементами через flex и `gap`.
- Основа shadcn (Radix или Base UI) ещё не выбрана. Когда выберем, она будет записана в `components.json`: компоненты на другой основе не добавляй. Пока `components.json` нет, `shadcn init` и `shadcn add` не запускай: основа выбирается при init.
- Доступность: семантические теги, `aria-label` у кнопок-иконок, управление с клавиатуры.

## Ошибки

- Ошибки собирает Sentry (`@sentry/nextjs`, с каркасом): браузер и доска подключаются в `instrumentation-client.ts`, сервер в `instrumentation.ts`, плюс страница `app/global-error.tsx`.
- Карты исходников (source maps) загружает CI.

## Тесты

- Компоненты: React Testing Library. Для `shared/ui` и интерфейса слайсов пишем stories в Storybook (с каркасом).
- Холст и рендер проверяем в браузерном режиме Vitest или в Playwright.
- После правок в `src/`: `pnpm --filter @tabula/web lint:fsd`.

## Документация

- Next.js установленной версии: `node_modules/next/dist/docs/` в `apps/web` (Next 16.2 и выше); без node_modules: https://nextjs.org/docs/llms.txt
- FSD с Next.js: https://feature-sliced.design/docs/guides/tech/with-nextjs
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview.md; Zustand: https://zustand.docs.pmnd.rs/llms.txt; React: https://react.dev/llms.txt
- shadcn/ui: https://ui.shadcn.com/llms.txt (скилл shadcn подключим, когда появится `components.json`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
