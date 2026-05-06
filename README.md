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
cat DBInit/6-upgrade-mushroom-field-lengths.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
cat DBInit/7-upgrade-user-consents.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
```

### One-time замена baseline грибов из CSV

Если нужно заменить старые моковые грибы в уже существующей БД на актуальный CSV baseline:

```bash
cat DBInit/6-replace-mushrooms-csv.sql | docker exec -i fungi-db psql -U <DB_USER> -d <DB_NAME> -p <DB_PORT>
```

Генерация SQL из `DBInit/data/mushrooms.csv`:

```bash
python3 DBInit/scripts/generate_mushrooms_seed.py
```

## Документация локально (Docker)

```bash
docker compose --profile docs up fungi-docs
```
