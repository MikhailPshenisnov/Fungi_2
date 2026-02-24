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
- `npm run design:lint`
- `npm run stories:check`
- `npm run build`
- `npm run storybook:build`

## Storybook checklist
- Для нового/измененного UI обновлены stories.
- Покрыты базовые состояния (default/disabled/loading/error/empty где релевантно).
- Нет зависимости stories от backend.
- Для нового `shared/ui` компонента story должна существовать: можно сгенерировать через `npm run scaffold:ui -- <ComponentName>` или `npm run stories:sync`.
- Для универсальных composition-компонентов в `shared/ui` использовать `npm run scaffold:ui -- <ComponentName> --category=composites`.
- Draft stories (`Draft/*`, `tags: ['wip']`) должны быть переведены в финальные `Shared/UI/*` после ревью компонента.
- Удаление `shared/ui` компонентов делаем только через `npm run remove:ui -- <ComponentName> --yes` (при одинаковом имени в категориях добавить `--category=...`).

## Review checklist
- Корректный слой и API границы.
- Нет debug-кода и временных заглушек.
- UI-изменения подтверждены Storybook-скриншотами.
- UI-слой не содержит raw-цветов и primitive-токенов вне `tokens.css`.

## ADR workflow
- Для архитектурных изменений создавай ADR в `docs/adr` на базе `docs/adr/0000-template.md`.
- Формат имени: `NNNN-kebab-case-title.md`.
- В PR с архитектурными изменениями должна быть ссылка на ADR (или явное объяснение, почему ADR не нужен).
- Если решение принято командой, меняем `Status` на `Accepted`.
- Если решение заменено, старый ADR помечаем `Superseded` и ссылаемся на новый.

## Design Semantics Enforcement
`design:lint` обязателен для PR, где есть изменения в:
- `src/shared/assets/styles/tokens.css`
- `src/**/*.css`
- `src/**/*.{ts,tsx}` (если затронуты inline styles/дизайн-слой)

`design:lint` валидирует:
1. Запрет прямых цветовых литералов вне `tokens.css`.
2. Запрет `var(--ref-...)` вне `tokens.css`.
3. Запрет legacy-алиасов вида `var(--color-text)`.

## Icons policy
- UI-иконки храним только в `src/shared/assets/icons`.
- Импорт UI-иконок в коде делаем только через `@shared/assets/icons` (через `index.ts`).
- В `public` храним только URL-ассеты (branding/контент), не UI-иконки.
- После добавления/переименования `*.svg` запускаем:
  - `npm run icons:sync`
  - `npm run icons:check`
