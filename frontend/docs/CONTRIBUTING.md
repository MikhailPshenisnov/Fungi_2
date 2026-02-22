# Contributing Rules

## Before coding
- Уточни слой, куда относится изменение (`shared/entities/features/widgets/pages`).
- Проверь, нет ли уже похожего компонента в `shared/ui`.
- Для нового публичного UI-компонента сразу запланируй story.

## While coding
- Не нарушай направление импортов по слоям.
- Экспортируй модуль только через `index.ts`.
- Не добавляй сетевые запросы в компоненты-презентеры.

## Validation checklist
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run storybook:build`

## Storybook checklist
- Для нового/измененного UI обновлены stories.
- Покрыты базовые состояния (default/disabled/loading/error/empty где релевантно).
- Нет зависимости stories от backend.

## Review checklist
- Корректный слой и API границы.
- Нет debug-кода и временных заглушек.
- UI-изменения подтверждены Storybook-скриншотами.
