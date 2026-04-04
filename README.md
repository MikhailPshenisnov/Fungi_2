# Fungi_2

Репозиторий для реализации новой версии приложения Fungi.

Активный веб-клиент в runtime: `frontend/` (rewrite).  
Папка `frontend_fungi/` оставлена в репозитории как архив и в docker/runtime больше не используется.

## Единая документация

- Основной источник документации: `docs/` (MkDocs).
- Быстрый старт: `docs/getting-started/index.md`.
- Backend API и контракты: `docs/backend-api/index.md`.
- Процессы разработки: `docs/workflow/index.md`.

## Быстрый запуск

```bash
cp .env.example .env
```

Проверьте обязательные переменные в `.env`: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_CONNECTION_STRING`, `JWT_KEY`, `DEFAULT_SUPERUSER_USERNAME`, `DEFAULT_SUPERUSER_PASSWORD`.

```bash
docker compose up -d --build
```

Команда поднимает: `db + backend + rewrite frontend`.

## Важно для существующей БД

Если база уже была создана раньше (старый docker volume), после обновления backend нужно один раз применить upgrade-скрипты:

```bash
cat DBInit/2-upgrade-avatar.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/3-upgrade-rbac.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/4-upgrade-articles-workflow.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/5-upgrade-mushrooms-workflow.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
```

## Документация локально (Docker)

```bash
docker compose --profile docs up fungi-docs
```
