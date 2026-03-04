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
- snapshot OpenAPI: `QuickStart/Fungi_api_swagger.json`.

## Что обновлять при изменениях

- изменение API (routes/DTO/auth/codes):
  - обновить `docs/backend-api/*`;
  - обновить `QuickStart/Fungi_api_swagger.json`;
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

## Релизный чеклист backend (существующая БД)

- применить SQL upgrade-скрипты:
  - `DBInit/2-upgrade-avatar.sql`;
  - `DBInit/3-upgrade-rbac.sql`.
- перезапустить backend после применения upgrade-скриптов.
- обновить OpenAPI snapshot:
  - `curl -fsS http://localhost:5000/swagger/v1/swagger.json -o QuickStart/Fungi_api_swagger.json`.
- выполнить smoke-проверку:
  - login;
  - `GET /Users/GetCurrentUserProfile`;
  - upload/delete avatar;
  - доступ к `GET /Roles/GetAllPermissions`.
