# ADR-0003: Бэк проверяет запросы схемами Zod из contracts

- Статус: Принято
- Дата: 11.11.2026
- Кто решил: архитектор фронтенда
- Связано: [архитектура, раздел 5](../architecture/frontend.md), [ADR-0002](0002-monorepo.md)

## Контекст

Схемы Zod в `packages/contracts` описывают данные между фронтом, бэком и воркером. Нужно было решить, чем бэк проверяет входящие запросы: теми же схемами или своими DTO (например, class-validator).

## Решение

Бэк проверяет запросы теми же схемами Zod из `packages/contracts`. В NestJS 12 через Standard Schema (`StandardSchemaValidationPipe` в `@Body`, `@Query`, `@Param`, Swagger через `standardSchemaConverter`), в NestJS 11 через пакет nestjs-zod. Версию NestJS выбирает бэк.

## Рассмотренные варианты

- DTO на class-validator: фронт получал бы типы только генерацией из Swagger, и у одних данных было бы два описания.

## Последствия

- Одна схема даёт и проверку на бэке, и тип на фронте.
- В шлюзах Socket.IO пайп проверки возвращает `WsException` через `exceptionFactory`.
- Схемы должны ложиться на JSON: даты через `z.iso.datetime()`, без `transform`.

## Что меняется для агентов

В `apps/api/AGENTS.md` способ проверки записан как решённый; вопрос убран из «Ещё не решено» в корневом AGENTS.md.
