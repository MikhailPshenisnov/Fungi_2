# Storybook Guide

## Назначение

Storybook фиксирует визуальный контракт UI и снижает риск регрессий при рефакторинге.

## Быстрый старт

```bash
cd frontend
npm install
npm run storybook
```

- dev-сервер поднимается на `http://localhost:6006`;
- для production-сборки Storybook:

```bash
npm run storybook:build
```

- для автоматического smoke/a11y прогона:

```bash
npm run storybook:check
```

## Quality Gates

Минимум перед PR с UI-изменениями:

```bash
npm run stories:check
npm run storybook:build
npm run storybook:check
npm run test:components
```

Что проверяется:

- `stories:check` — у всех компонентов `shared/ui` есть `.stories.tsx`;
- `storybook:build` — история корректно собирается;
- `storybook:check` — запуск test-runner (`smoke + a11y`);
- `test:components` — unit/component тесты `shared/ui/primitives`.

## Область покрытия

- `shared/ui/*` — обязательно;
- `features/*/ui/*` — если компонент имеет самостоятельное UX-поведение;
- `entities/*/ui/*` — если компонент используется в нескольких сценариях;
- `widgets/pages` — для ключевых пользовательских сценариев (каталоги, детали, editor-flow).

## Coverage matrix

- source of truth для матрицы: [`docs/frontend/storybook-coverage.md`](../../docs/frontend/storybook-coverage.md);
- как обновить матрицу:

```bash
cd frontend
npm run stories:coverage
```

- как валидировать перед обновлением матрицы:

```bash
npm run stories:check
npm run stories:coverage:check
npm run storybook:build
npm run storybook:check
```

- когда обновлять матрицу:
  - добавили/удалили/переименовали story;
  - изменили Storybook `title` у story;
  - добавили новый ключевой page/editor/auth сценарий;
  - изменили минимальный набор обязательных состояний.

## Конвенции для stories

- stories храним рядом с компонентом: `Component.stories.tsx`;
- формат `title`:
  - `Shared/UI/Primitives/<Component>`;
  - `Shared/UI/Composites/<Component>`;
  - `Features/<Feature>/<Component>`;
  - `Entities/<Entity>/<Component>`;
  - `Widgets/<Widget>`;
  - `Pages/<Section>/<Page>`;
- для интерактивных компонентов добавляем `play`-сценарии, где это имеет смысл;
- все данные в story — только фикстуры/моки, без реальных HTTP-запросов.

## Обязательные состояния

Для каждого публичного компонента/экрана покрываем применимые состояния:

- `Default`;
- `Loading`;
- `Empty`;
- `Error`;
- `Disabled` (если есть интеракция или форма).

## Провайдеры и контексты

Глобально в `.storybook/preview.ts` уже подключены:

- `MemoryRouter`;
- `ToastProvider`;
- `@app/styles/global.css`.
- В `.storybook/main.ts` подключен `@storybook/addon-vitest` для Storybook+Vitest интеграции.

Если история использует дополнительные зависимости, подключаем их внутри story:

- `SessionProvider` для auth/session-сценариев;
- `QueryClientProvider` для экранов с `react-query` (с `retry: false` для предсказуемых прогонов).

## Troubleshooting

1. Ошибка `useLocation() may be used only in the context of a <Router> component`.
Решение: убедиться, что история рендерится внутри `MemoryRouter` (глобальный decorator в `preview.ts` не удален).

2. Ошибка `You cannot render a <Router> inside another <Router>`.
Решение: не оборачивать story в `BrowserRouter/MemoryRouter`, если router уже приходит из глобального decorator.

3. Ошибка `useToast must be used inside ToastProvider`.
Решение: не отключать глобальный `ToastProvider`; для изолированных тестовых оберток оставить провайдер.

4. `storybook:test` падает с `ECONNREFUSED`.
Решение: сначала поднять Storybook (`npm run storybook`) или запускать связку `npm run storybook:check`.

5. Порт `6006` занят.
Решение: запускать на другом порту, например `npm run storybook -- --port 6007`.

## Политика обновления

- Любое изменение UI-контракта должно сопровождаться обновлением stories.
- Если меняется набор story-обязательств или правила, обновляем:
  - `frontend/docs/STORYBOOK.md`;
  - `frontend/README.md` (краткий runbook);
  - `docs/frontend/index.md` (публичная проектная документация).
