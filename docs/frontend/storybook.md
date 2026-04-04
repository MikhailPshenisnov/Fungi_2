# Storybook (Rewrite Frontend)

## Зачем

Storybook в `frontend/` используется как контракт UI-компонентов и page-level сценариев:

- фиксируем визуальные состояния и интеракции;
- ловим регрессии до ручного QA;
- проверяем a11y/smoke в автоматическом прогоне.

## Быстрый старт

```bash
cd frontend
npm install
npm run storybook
```

- dev-сервер Storybook: `http://localhost:6006`;
- production-сборка Storybook:

```bash
npm run storybook:build
```

## Проверки перед PR

```bash
npm run stories:check
npm run storybook:build
npm run storybook:check
npm run test:components
```

Что проверяют команды:

- `stories:check` — у всех компонентов `shared/ui` есть `.stories.tsx`;
- `storybook:build` — сборка Storybook не падает;
- `storybook:check` — поднимает Storybook и запускает smoke/a11y тест-раннер;
- `test:components` — unit/component тесты `shared/ui/primitives`.

## Coverage matrix

- актуальная матрица: [docs/frontend/storybook-coverage.md](storybook-coverage.md);
- для обновления матрицы:

```bash
cd frontend
npm run stories:coverage
```

- после изменений в stories прогоняйте:

```bash
npm run stories:check
npm run stories:coverage:check
npm run storybook:build
npm run storybook:check
```

- матрицу обновляем при добавлении/удалении/переименовании stories, изменении `title` и изменении обязательных state-сценариев.

## Провайдеры и окружение

Глобально в `.storybook/preview.ts` уже подключены:

- `MemoryRouter`;
- `ToastProvider`;
- `@app/styles/global.css`.
- В `.storybook/main.ts` подключен `@storybook/addon-vitest`.

Если конкретная story использует дополнительные контексты, оборачиваем ее локально:

- `SessionProvider` для auth/profile/editor сценариев;
- `QueryClientProvider` для экранов с `react-query`.

## Правила написания stories

- хранить рядом с компонентом: `Component.stories.tsx`;
- `title` использовать по слоям:
  - `Shared/UI/Primitives/<Component>`;
  - `Shared/UI/Composites/<Component>`;
  - `Features/<Feature>/<Component>`;
  - `Entities/<Entity>/<Component>`;
  - `Widgets/<Widget>`;
  - `Pages/<Section>/<Page>`.
- реальные HTTP-запросы внутри stories запрещены;
- использовать только fixtures/mock-data;
- для интерактивных компонентов добавлять `play`-сценарий, где он действительно полезен.

## Минимальные состояния

Для публичных UI-компонентов и page-level историй покрываем применимые состояния:

- `default` (или `filled`);
- `loading`;
- `empty`;
- `error`;
- `disabled` (для форм/действий).

## Troubleshooting

1. `useLocation() may be used only in the context of a <Router>`.
Проверить, что story не потеряла глобальный `MemoryRouter` decorator.

2. `You cannot render a <Router> inside another <Router>`.
Убрать локальный `BrowserRouter/MemoryRouter` из story, если router уже приходит из `preview.ts`.

3. `useToast must be used inside ToastProvider`.
Проверить, что `ToastProvider` не удален из глобального decorator.

4. `storybook:test`/`storybook:check` падает по соединению.
Поднять Storybook или запускать `storybook:check`, который поднимает сервер автоматически.

5. Порт `6006` занят.
Запустить на другом порту: `npm run storybook -- --port 6007`.
