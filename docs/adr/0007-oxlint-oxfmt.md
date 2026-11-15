# ADR-0007: Линт и формат: oxlint, oxfmt и Steiger

- Статус: Принято
- Дата: 11.11.2026
- Кто решил: архитектор фронтенда
- Связано: [AGENTS.md, «Команды» и «Версии и ловушки»](../../AGENTS.md), [ADR-0001](0001-agent-rules.md)

## Контекст

В архитектуре были записаны ESLint с typescript-eslint и Prettier. Next.js 16 удалил `next lint`, а `next build` линтер больше не запускает, так что линтер выбираем сами. Steiger проверяет границы FSD отдельной программой и от выбора линтера не зависит.

## Решение

- Линтер: oxlint (1.93.0 на 11.11.2026, MIT, стабилен с версии 1.0). Плагины: eslint, typescript, unicorn, oxc, react, jsx-a11y, import, nextjs, vitest. Явно включаем правила, которые выключены по умолчанию: `react/rules-of-hooks`, `import/no-cycle`, `typescript/no-explicit-any`, `typescript/ban-ts-comment`; правилам nextjs задаём ту же строгость, что в core-web-vitals.
- Форматтер: oxfmt (0.78.0, MIT, бета). Сортировка классов Tailwind (вместе с функциями `cn`, `cva`, `clsx`) и сортировка импортов встроены; ширину строки задаём явно.
- Границы FSD: Steiger (0.10.0) отдельным шагом CI.
- Версии oxlint, oxlint-tsgolint и oxfmt закрепляем точно в catalog и обновляем отдельным PR. Линт с учётом типов, JS-плагины и правила nursery не подпадают под semver, а формат oxfmt между версиями меняется.
- Линт с учётом типов (oxlint-tsgolint) проверяем на каркасе: он работает на встроенном TypeScript 7 и требует tsconfig, совместимый с TypeScript 7 (без `baseUrl` и `ignoreDeprecations`). Если пройдёт, включаем `typescript/no-floating-promises` и `typescript/no-misused-promises`.

## Рассмотренные варианты

- ESLint, typescript-eslint и Prettier: больше пакетов и конфигов, линт медленнее; typescript-eslint поддерживает TypeScript только ниже 6.1.
- oxlint и Prettier: формат стабильнее, но сортировка классов Tailwind и импортов требует плагинов Prettier, а расширений редактора нужно два.

## Последствия

- Одно расширение VS Code (`oxc.oxc-vscode`) на линт и формат. Из зависимостей уходят ESLint, typescript-eslint, eslint-config-next, Prettier и eslint-config-prettier.
- В oxlint нет правила Next `no-location-assign-relative-destination` (появилось в Next 16.3): принимаем этот пробел.
- Плагины ESLint (например, `@tanstack/eslint-plugin-query`) подключаются только через JS-плагины oxlint, а они в альфе и без информации о типах: пробуем на каркасе, без них обходимся.
- oxfmt форматирует JSX, TSX и JSON как Prettier, обычный JS и TS совпадают с Prettier примерно на 93%. Открыт баг: порядок классов Tailwind на macOS и Linux может различаться. В первый день прогоняем `oxfmt --check` на Mac и в Linux-CI. Откат на Prettier: один коммит переформатирования.
- TypeScript остаётся 6.0.x, но теперь из-за NestJS (Nest CLI 12 зависит от TypeScript 6.0, `@nestjs/swagger` требует TypeScript 5.5 или 6), а не из-за линтера.

## Что меняется для агентов

В корневом AGENTS.md ESLint и Prettier заменены на oxlint и oxfmt: команды проверки, версии и ловушки, запрет комментариев `oxlint-disable` и `eslint-disable`. То же в скилле `project-review` и в `docs/ai/README.md`.
