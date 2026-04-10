# Процессы разработки

## Базовый workflow

- работа ведется в feature-ветках от актуального `dev`;
- изменения попадают в `dev` через Pull Request;
- прямые пуши в `dev` не рекомендуются;
- PR должен содержать понятное описание и шаги проверки.

## Правила сопровождения документации

## Где хранится источник истины

- общая документация: `docs/` (MkDocs);
- API-контракт: backend-код + swagger-аннотации + live OpenAPI (`/swagger/v1/swagger.json`);
- snapshot OpenAPI: `quickstart/fungi-api-swagger.json`.

## Что обновлять при изменениях

- изменение API (routes/DTO/auth/codes):
  - обновить `docs/backend-api/*`;
  - обновить `quickstart/fungi-api-swagger.json`;
  - добавить changelog для frontend/mobile при breaking changes.
- изменение архитектуры:
  - обновить `docs/architecture/*` и затронутые клиентские разделы.
- изменение процесса разработки:
  - обновить `docs/workflow/*`.

## Требования к PR

- PR с изменением API или архитектуры без обновления docs считается неполным.
- В PR описывать:
  - что изменилось;
  - есть ли breaking changes;
  - какие страницы docs обновлены.

## Минимальные quality gates

- backend: сборка проходит;
- frontend: сборка/линт проходят;
- docs: `mkdocs build --strict` проходит в CI.

## Локальные git-quality проверки

В корне репозитория подключены:

- `husky`;
- `lint-staged`;
- `commitlint` (Conventional Commits).

Установка (один раз после `git clone`):

```bash
npm install
```

Что проверяется в hooks:

- `pre-commit`:
  - `frontend/**/*.{ts,tsx,js,jsx}` -> `eslint --fix`;
  - `frontend/**/*.css` -> `stylelint --fix`;
  - `*.{md,yml,yaml,json}` -> `prettier --write`.
- `commit-msg`:
  - формат commit message через `commitlint` + `@commitlint/config-conventional`.

Политика:

- backend-сборка и backend-тесты не запускаются в pre-commit (они остаются в CI);
- commit message должен соответствовать Conventional Commits, иначе коммит блокируется.

## Naming standard

Единый стандарт именования в репозитории:

- директории и служебные файлы: `kebab-case`;
- React components: `PascalCase.tsx` внутри `kebab-case` директорий;
- C# типы/файлы: `PascalCase`;
- SQL миграции: `NN-description.sql`;
- docs-страницы: `kebab-case` (исключение: `README.md`).

`mobile-dev` не входит в автоматический rename batch и сопровождается отдельно.

## CI (GitHub Actions)

Единый workflow `.github/workflows/ci.yml` запускается на `push` (`dev`, `feature/**`) и `pull_request`:

- `frontend` job:
  - `npm run lint`;
  - `npm run typecheck`;
  - `npm run stories:check`;
  - `npm run storybook:build`;
  - `npm run test:components`.
- `backend` job:
  - `dotnet restore/build/test` для `BackendFungi/BackendFungi.sln`.
- `e2e-smoke` job:
  - поднимает `fungi-db + fungi-backend` через docker compose;
  - ждет readiness backend по `http://localhost:5000/swagger/v1/swagger.json`;
  - запускает Playwright smoke (`npm --prefix frontend run e2e:smoke`);
  - публикует `playwright-report` и `test-results` как CI artifacts.
- `docs` job:
  - `mkdocs build --strict`.

## E2E smoke (rewrite frontend)

Базовые browser smoke-тесты находятся в `frontend/tests/e2e/workflows` и покрывают:

- `auth` (login/logout);
- `catalog` (открытие списка и переход в деталку);
- `profile` (доступ в профиль из header);
- `likes` (toggle лайка авторизованным пользователем);
- `editor workflows`:
  - статьи (draft -> submit);
  - грибы (draft -> submit).

Локальный запуск:

```bash
docker compose up -d --build fungi-db fungi-backend
npm --prefix frontend run e2e:smoke
```

## i18n решение (P2)

На текущем этапе зафиксировано решение: **RU-only без технической подготовки под мультиязычность**.

Условия пересмотра решения:

- явный product-запрос на EN/мультиязычность;
- запуск новых регионов/аудиторий;
- отдельный утвержденный backlog на i18n-этап.

## Релизный чеклист backend (существующая БД)

- применить SQL upgrade-скрипты:
  - `DBInit/2-upgrade-avatar.sql`;
  - `DBInit/3-upgrade-rbac.sql`.
- перезапустить backend после применения upgrade-скриптов.
- обновить OpenAPI snapshot:
  - `curl -fsS http://localhost:5000/swagger/v1/swagger.json -o quickstart/fungi-api-swagger.json`.
- выполнить smoke-проверку:
  - login;
  - `GET /Users/GetCurrentUserProfile`;
  - upload/delete avatar;
  - доступ к `GET /Roles/GetAllPermissions`.
