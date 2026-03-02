# Storybook Guide

## Зачем
Storybook фиксирует визуальный контракт компонентов и помогает безопасно рефакторить UI.

## Область покрытия
- `shared/ui/*` — обязательно
- `features/*/ui/*` — если компонент имеет самостоятельное UI-поведение
- `entities/*/ui/*` — если используется в 2+ местах

## Формат названий
- `Shared/UI/<Component>`
- `Entities/<Entity>/<Component>`
- `Features/<Feature>/<Component>`
- `Widgets/<Widget>`

## Обязательные сценарии
Для каждого публичного компонента:
- `Default`
- `Disabled` (если применимо)
- `Loading` (если применимо)
- `Error` (если компонент рендерит ошибку)
- `Empty` (для списков/таблиц/контентных блоков)

## Технические правила
- stories пишем на `tsx`;
- не делаем HTTP внутри story;
- используем фикстуры и mock-data;
- не используем глобальные стили кроме `app/styles/global.css`.

## CI-рекомендация
На каждый PR желательно запускать:
- `npm run storybook:build`
- `npm run storybook:check`

Это гарантирует, что Storybook-конфигурация валидна и stories проходят smoke/a11y проверки.
