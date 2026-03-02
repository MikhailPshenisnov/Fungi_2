# Быстрый старт

Этот раздел содержит минимальные шаги для запуска проекта локально.

## Требования

- Docker Desktop
- Git

## Запуск через Docker

В корне репозитория:

```bash
docker compose up -d --build
```

Проверка контейнеров:

```bash
docker ps -a
```

Swagger UI после запуска:

- `http://localhost:5000/swagger/index.html`

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
docker compose up fungi-docs
```

Сборка docs (Docker):

```bash
docker compose run --rm fungi-docs mkdocs build --strict
```

Остановка docs-сервиса:

```bash
docker compose stop fungi-docs
```
