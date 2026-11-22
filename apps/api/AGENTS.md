# apps/api: бэкенд

NestJS 12, Socket.IO 4 и Prisma 7 ([ADR-0009](../../docs/adr/0009-nestjs-prisma.md)). Общие правила в корневом [AGENTS.md](../../AGENTS.md).

Правила составлены по [архитектуре фронтенда](../../docs/architecture/frontend.md). При создании базовых приложений пользователь подтвердил использование правил из архива `project-agent-rules.zip`. Файл дальше ведёт бэкенд.

## Команды

- `pnpm --filter @tabula/api dev`: NestJS на `http://localhost:4000` с перезапуском при изменениях; для модуля авторизации нужен локальный PostgreSQL.
- `pnpm --filter @tabula/api build`: сборка в `dist`.
- `pnpm --filter @tabula/api start`: запуск собранного приложения; локальный `.env` загружается, если существует.
- `pnpm --filter @tabula/api check-types`: TypeScript без сборки.
- `pnpm --filter @tabula/api test`: `vitest run`, PostgreSQL и почтовый транспорт в тестах подменяются.
- Схема и миграции в `prisma/`. Перед первым запуском применяй миграции только к локальной БД.

## Правила

- Входные данные проверяем теми же схемами Zod из contracts ([ADR-0003](../../docs/adr/0003-zod-validation-on-backend.md)): через Standard Schema (`StandardSchemaValidationPipe` из NestJS 12), документация Swagger из тех же схем. DTO на class-validator не заводим.
- В шлюзах Socket.IO пайп проверки создаём с `exceptionFactory`, который возвращает `WsException`: иначе клиент получит HTTP-исключение.
- Права проверяем в каждом HTTP-запросе и в каждом событии сокета, а не только при подключении. Подключение сокета авторизуем по cookie сессии.
- Наблюдатель не отправляет события, которые меняют документ доски: ему запрещены `board:update` и шаг 2 `board:sync` (ответ с изменениями), а шаг 1 (запрос состояния) разрешён.
- Апдейт доски (Yjs поверх Socket.IO, [ADR-0005](../../docs/adr/0005-yjs-sync.md)): схемой Zod проверяем только конверт (boardId, размер). Содержимое проверяем после применения апдейта к копии документа через `board-doc`: схема элементов и лимиты из contracts. Не прошло: отклоняем.
- Апдейт доски сначала сохраняем, потом рассылаем другим участникам. Где хранить, бэк ещё решает (рекомендация: журнал апдейтов в Postgres со снимками, рассылка через redis-streams-adapter). До ADR схему хранения не заводи: оставь `TODO(решение): где состояние доски на бэке`.
- Отклонённый апдейт (права, лимит, схема) возвращаем клиенту ошибкой: клиент сбрасывает свою копию документа и заново входит на доску.
- Команды вне документа (комментарии, задачи ИИ) несут ключ идемпотентности: повторная доставка не создаёт дублей.
- Задачи ИИ ставим в очередь, результат храним по jobId; событие `ai:job-finished` только сигнал, данные клиент забирает запросом.
- Сессия: короткий access и refresh с ротацией в cookie с флагами HttpOnly, Secure и SameSite.
- Фронт и API на одном домене через Caddy ([ADR-0004](../../docs/adr/0004-single-domain-caddy.md)): CORS не включаем.
- Ключи LLM, S3, Telegram и SMTP живут только здесь и в `apps/worker`.
- Схему базы меняем только миграциями Prisma из репозитория (`apps/api/prisma`).
- Prisma 7: у CLI метка `latest` в npm указывает на 8.0 RC, версию из catalog не поднимай, `prisma` и `@prisma/client` держим одной версии.
- Для запуска авторизации нужны `DATABASE_URL`, `APP_URL` и локальные PostgreSQL и Mailpit. За Caddy задавай `TRUSTED_PROXY` адресом или подсетью доверенного прокси, чтобы ограничение по IP считалось по клиентам.

## Документация

- NestJS: https://docs.nestjs.com/llms.txt, главы в Markdown: `https://docs.nestjs.com/<глава>.md`
- Socket.IO: https://socket.io/docs/v4/ (комнаты, адаптеры, подтверждения)
- BullMQ с NestJS: https://docs.bullmq.io/guide/nestjs
