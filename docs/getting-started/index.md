# Быстрый старт

Этот раздел содержит минимальные шаги для запуска проекта локально.

## Требования

- Docker Desktop
- Git
- .NET SDK `7.0.410` (для локального запуска backend вне Docker, версия зафиксирована в `global.json`)

## Запуск через Docker

В корне репозитория:

```bash
cp .env.example .env
```

Минимально проверьте значения в `.env`:

- `DB_NAME`;
- `DB_USER`;
- `DB_PASSWORD`;
- `DB_PORT`;
- `DB_CONNECTION_STRING`;
- `JWT_KEY`;
- `DEFAULT_SUPERUSER_USERNAME`;
- `DEFAULT_SUPERUSER_PASSWORD`.

```bash
docker compose up -d --build
```

По умолчанию поднимаются контейнеры `fungi-db`, `fungi-backend`, `fungi-frontend` (rewrite-клиент из `frontend/`).

Проверка контейнеров:

```bash
docker ps -a
```

Swagger UI после запуска:

- `http://localhost:5000/swagger/index.html`

## Обязательный upgrade для уже существующей БД

Если база данных уже была создана раньше (старый docker volume), после обновления backend нужно один раз применить upgrade-скрипты:

```bash
cat DBInit/2-upgrade-avatar.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/3-upgrade-rbac.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/4-upgrade-articles-workflow.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/5-upgrade-mushrooms-workflow.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
```

Это единый обязательный шаг миграции перед проверкой login/profile/avatar/RBAC/editor-workflow.

Остановка:

```bash
docker compose down
```

## Полезные ссылки

- API-документация: [Backend API](../backend-api/index.md)
- Статичный OpenAPI snapshot: `QuickStart/Fungi_api_swagger.json`

## Локальный запуск документации

Запуск docs в режиме разработки (Docker):

```bash
docker compose --profile docs up fungi-docs
```

Сборка docs (Docker):

```bash
docker compose --profile docs run --rm fungi-docs mkdocs build --strict
```

Остановка docs-сервиса:

```bash
docker compose stop fungi-docs
```
