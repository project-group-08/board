# ИИ-агенты в проекте

Как устроены правила для агентов, что читает каждый инструмент, куда добавлять новое правило и что доделать, когда появится каркас. Решение и причины: [ADR-0001](../adr/0001-agent-rules.md).

## С чего начать

1. Windows: включи режим разработчика и клонируй с `git clone -c core.symlinks=true <адрес>`, иначе Claude Code не увидит скиллы.
2. Работаешь в Gemini CLI: настрой `.gemini/settings.json` (см. «Особенности агентов»).
3. Взял задачу: создай ветку от свежего `develop` и дай агенту ключ и текст задачи.
4. Скилл вызывай по имени: в Codex `$project-fsd-slice`, в Claude Code `/project-fsd-slice`, в остальных агентах словами «открой скилл project-fsd-slice».
5. Перед PR попроси агента сделать ревью по скиллу `project-review`, сам прочитай дифф и итог проверок. За PR отвечаешь ты, а не агент.

## Что где лежит

| Файл                                                | Зачем                                                                                              | Кто читает                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `AGENTS.md` в корне                                 | правила для всего репозитория                                                                      | все агенты                                                  |
| `AGENTS.md` в `apps/*` и `packages/*`               | правила пакета                                                                                     | все агенты, когда работают в пакете                         |
| `CLAUDE.md` рядом с каждым `AGENTS.md`              | строка `@AGENTS.md` и комментарий                                                                  | Claude Code                                                 |
| `.agents/skills/project-*/SKILL.md`                 | процедуры: слайс FSD, контракты, событие сокета, элемент доски, ревью, ADR, каркас                 | Codex, Cursor, Copilot, Antigravity, Devin, Gemini CLI      |
| `.claude/skills/project-*`                          | симлинки на те же скиллы                                                                           | Claude Code                                                 |
| `.claude/settings.json`                             | запреты для Claude Code: чтение `.env`, force-push, обход хуков; любой `git push` с подтверждением | Claude Code                                                 |
| `docs/architecture/frontend.md`                     | текст доски архитектуры                                                                            | люди и агенты по ссылке                                     |
| `docs/adr/`                                         | решения и причины                                                                                  | люди и агенты по ссылке                                     |
| `.agents/skills/project-setup/scripts/scaffold.mjs` | каркас одной командой: папки по архитектуре и зависимости фронтенда                                | агенты через скилл `project-setup`, люди запускают напрямую |

Запреты в `settings.json` ловят типичные формы команд, а не любой обход. Надёжная граница: хук Git перед пушем, CI и защита веток `main` и `develop`.

## Особенности агентов

- **Claude Code** сам читает AGENTS.md с версии 2.1.277, но только если в рабочей папке и выше нет `CLAUDE.md`, `.claude/CLAUDE.md` или `CLAUDE.local.md`. Поэтому у нас CLAUDE.md с импортом `@AGENTS.md`: правила доходят в любом случае и не грузятся дважды. CLAUDE.md пакета (а с ним AGENTS.md) Claude подгружает, когда читает или правит файл в этом пакете.
- **Codex** склеивает AGENTS.md от корня репозитория до папки, где запущен, и перестаёт добавлять файлы после 32 КиБ. Правила пакета он видит, только если запущен в папке пакета или ниже. Скиллы берёт только из `.agents/skills`.
- **Cursor и Copilot** берут ближайший к файлу AGENTS.md и читают и `.agents/skills`, и `.claude/skills`.
- **Antigravity** (замена Gemini CLI) не читает AGENTS.md в подпапках ниже рабочей. Поэтому корневой AGENTS.md сам называет главные правила пакетов.
- **Gemini CLI** по умолчанию читает GEMINI.md. Работаешь в нём: добавь в `.gemini/settings.json` `{"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}}`.
- **Junie** читает корневой AGENTS.md; видит ли он `.agents/skills`, не проверено.

## Куда писать новое правило

| Правило                 | Куда                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| нужно везде и всегда    | корневой `AGENTS.md`, коротко и с причиной                                                            |
| касается одного пакета  | `AGENTS.md` пакета                                                                                    |
| многошаговая процедура  | скилл в `.agents/skills/` и строка в разделе «Скиллы» корневого AGENTS.md                             |
| не допускает исключений | oxlint, oxfmt, Steiger, TypeScript, хук Git, CI; для Claude Code ещё запрет в `.claude/settings.json` |
| объясняет, почему так   | ADR в `docs/adr/`                                                                                     |

Правила, которые проверяют oxlint, oxfmt и Steiger, в AGENTS.md не повторяем. Важное пишем в сам AGENTS.md, а не ссылкой: ссылку агент может не открыть.

## Как добавить скилл

1. Папка `.agents/skills/project-<имя>/` и в ней `SKILL.md`. Поле `name` совпадает с именем папки: латиница в нижнем регистре и дефисы, до 64 символов. Иначе Copilot молча не загрузит скилл.
2. Поле `description` до 1024 символов: сначала что делает, потом `Use when` и слова, по которым агент поймёт, что пора его открыть.
3. Тело короче 500 строк, главное в начале. Справочные файлы кладём рядом, не глубже одного уровня.
4. Симлинк для Claude Code: `ln -s ../../.agents/skills/project-<имя> .claude/skills/project-<имя>`.
5. Строка в разделе «Скиллы» корневого AGENTS.md: когда открывать скилл.
6. Проверка: `python3 -I scripts/check-agent-rules.py` (её же стоит запускать в CI).

## Сопровождение

- AGENTS.md и скиллы меняем через PR, как код.
- Генерируемый блок Next.js сохраняем без изменений: проверка символов относится к авторскому тексту, размер цепочки учитывает весь файл.
- Агент дважды ошибся одинаково: добавляем правило или уточняем существующее.
- Корневой AGENTS.md держим короче 200 строк. Корневой вместе с самым длинным AGENTS.md пакета должен весить меньше 30 КиБ (2 КиБ оставляем под блоки Next.js и Turborepo): проверка `python3 -I scripts/check-agent-rules.py`.
- Изменилась доска архитектуры: обновляем `docs/architecture/frontend.md` выгрузкой, руками его не правим.
- Личное не коммитим: `CLAUDE.local.md`, `.claude/settings.local.json`, `AGENTS.override.md` уже в `.gitignore`.
- Личный скилл Claude Code с тем же именем перекрывает командный, поэтому свои скиллы не называй `project-*`.

## Сделать с каркасом

Текущее состояние: базовые приложения созданы. Общие настройки TypeScript
вынесены в `packages/typescript-config`. Линт задаёт корневой `.oxlintrc.json`,
отличия Next.js находятся в его `overrides`. Форматтер настраивается
в корневом `.oxfmtrc.json` ([ADR-0010](../adr/0010-root-lint-format-config.md)). Команды запуска и проверок
описаны в корневом README. В Vitest API включён `restoreMocks: true`.
Пустые пакеты проверяются и собираются после появления исходников.

Steiger 0.10.0 с плагином FSD 0.8.2 пока сообщает об именах `_app`, `_pages`
и пустых папках каркаса. Правила не отключаем, структуру без отдельного
решения не меняем. Проверка на macOS, CI, инфраструктура, Sentry, Storybook
и e2e остаются отдельными задачами.

Пункт 1 закрывает тот, кто поднимает каркас, в PR каркаса. Пункты 2, 3, 4, 5, 10, 12, 13 и 14 делают отдельными задачами сразу после каркаса, пункт 11 закрывает ответственный за бэкенд. Пункты 6, 7, 8 и 9 по желанию, отдельными PR: берёт тот, кому они нужны.

1. Каркас: скилл `project-setup` (`node .agents/skills/project-setup/scripts/scaffold.mjs`) создаёт папки по архитектуре, `package.json` пакетов `@tabula/*`, catalog версий, закрепляет pnpm в `packageManager` и ставит зависимости фронтенда и бэкенда (NestJS 12, Prisma 7, [ADR-0009](../adr/0009-nestjs-prisma.md)); код не пишет. Выполняется первым, остальные пункты после него.
2. Раздел «Команды» корневого AGENTS.md: точные pnpm-скрипты и задачи turbo (format, lint, Steiger, typecheck, test, build), запуск одного теста, проверка одного пакета через `--filter`. Убрать пометки «с каркасом».
3. `turbo.json`: `"agentGuidance": true` и `description` у задач. Turborepo впишет свой блок в корневой AGENTS.md: закоммитить как есть.
4. Первый `next dev` под агентом впишет блок `nextjs-agent-rules` в `apps/web/AGENTS.md` (нужен Next 16.3 и выше; отключается `agentRules: false`): закоммитить как есть, не править.
5. Vitest: `restoreMocks: true`; `reporters` не задавать жёстко, иначе агенты потеряют короткий вывод (для CI отдельная настройка).
6. Скиллы вендоров ставит человек (или агент по его прямой просьбе) через `pnpm dlx skills add` с закоммиченным `skills-lock.json`:
   - shadcn/ui (`pnpm dlx skills add shadcn/ui`), когда появится `components.json`; алиасы `ui` на `@/shared/ui`, `utils` на `@/shared/lib/utils`;
   - FSD (`pnpm dlx skills add feature-sliced/skills`), только если его `references/framework-integration.md` не спорит с нашими `_app`, `_pages` и `app/` в корне;
   - Vercel `composition-patterns` для ревью компонентов; `react-best-practices` с оговоркой: его запрет barrel-файлов не касается публичного API слайсов FSD (`index.ts`);
   - Playwright test agents (`pnpm exec playwright init-agents --loop=claude`), когда появятся e2e. Команда перезаписывает `.mcp.json` целиком: сохрани его заранее и слей.
7. `.mcp.json`: `next-devtools-mcp` (ошибки компиляции и маршруты dev-сервера) и MCP shadcn.
8. Хуки Claude Code: после правки файла `oxfmt` и `oxlint --fix` из devDependencies проекта; блокирующий хук, если запретов в `settings.json` окажется мало.
9. Если в команде есть Codex: `.codex/config.toml` (не передавать в shell переменные `*KEY*`, `*SECRET*`, `*TOKEN*`) и `.codex/rules/` с запретом force-push и `--no-verify`.
10. Проверить на живой структуре: Steiger понимает слои `_app` и `_pages`; Cursor и Copilot не показывают скиллы дважды из-за симлинков; Codex из `apps/web` видит оба AGENTS.md (`codex --cd apps/web "List the instruction sources you loaded."`).
11. `apps/api/AGENTS.md`: ответственный за бэкенд сверяет правила, вписывает команды миграций Prisma и тестов и удаляет вводный абзац в начале файла.
12. Линт и формат по [ADR-0007](../adr/0007-oxlint-oxfmt.md) и [ADR-0010](../adr/0010-root-lint-format-config.md): корневые `.oxlintrc.json` с областями действия в `overrides` и `.oxfmtrc.json` (сортировка классов Tailwind с функциями `cn`, `cva`, `clsx`, сортировка импортов, ширина строки), `.vscode/extensions.json` с `oxc.oxc-vscode`. Линт с учётом типов включён в конфиге, проверен на tsconfig проекта; включены `no-floating-promises` и `no-misused-promises`. Проверка `oxfmt --check` на Mac и в Linux-CI остаётся отдельным шагом.
13. Sentry (его требует ТЗ): поставить по разделу «Ошибки» в `apps/web/AGENTS.md` и убрать там пометку «с каркасом». Docker-окружение, Makefile (`make up`) и хук Git перед пушем делает задача инфраструктуры: когда она готова, сверить с ней раздел «Git и PR» корневого AGENTS.md и снять там пометку «с каркасом». Что проверено 12.11.2026:

- Sentry: серверный `Sentry.init` лежит в `sentry.server.config.ts` и `sentry.edge.config.ts`, их подключает `instrumentation.ts`; в SDK 11 `withSentryConfig` импортируется из `@sentry/nextjs/config`. Токен загрузки карт исходников передаём задаче сборки через `passThroughEnv` в `turbo.json`, в `docker build` только через `--secret`.
- GlitchTip, если команда выберет его вместо Sentry: тот же SDK, но без записи сессий и профилирования. SDK 11 шлёт спаны потоком, а GlitchTip принимает транзакции, поэтому во всех `Sentry.init` ставим `traceLifecycle: 'static'`.

14. Конфиги приложения: `tsconfig` по разделу «Версии и ловушки» корневого AGENTS.md, `next.config` с `output: 'standalone'`, Tailwind CSS 4 и PostCSS, `turbo` в catalog и корневом `package.json`, CI в GitHub Actions с проверками из раздела «Команды», Storybook и Playwright, когда до них дойдёт работа.

## Что не берём

- `vercel-labs/next-skills`: сняты с поддержки, знания о Next даёт документация в node_modules.
- Сторонние скиллы для NestJS, Zod и pnpm: официальных нет, сторонние не проверены.
- MCP документации Zod (Inkeep) и Konva (CrawlChat): сторонние сервисы, в общий конфиг не кладём.
- Скилл `yjs-best-practices` от Liveblocks целиком: он про их провайдер. Правило одной копии `yjs` уже в AGENTS.md.
