# Architecture Notes

Проект использует Feature-Sliced подход с отдельным UI-kit.

## Основные принципы
- Строгие границы слоев.
- Public API каждого модуля через `index.ts`.
- Разделение server state и client state.
- UI-компоненты документируются в Storybook.

## Слои
- `app`: bootstrap, providers, router, global styles.
- `processes`: редкие сквозные бизнес-процессы.
- `pages`: маршрутные композиции.
- `widgets`: крупные блоки страниц.
- `features`: сценарии пользователя.
- `entities`: бизнес-сущности.
- `shared`: инфраструктура и примитивы.

## Data flow
- HTTP-клиент и общие transport-утилиты: `shared/api`.
- Доменные адаптеры: в `entities/*/api`.
- Кэш запросов: React Query.

## UI flow
- Базовые примитивы: `shared/ui`.
- Композиция примитивов в domain/feature/widget слоях.
- Никаких глобальных конфликтных классов с generic-именами.

## Anti-patterns
- API-вызовы внутри простых UI-примитивов.
- Импорт из внутренних папок другого модуля в обход его `index.ts`.
- Повторение одного и того же request/error/loading-кода в разных страницах.
