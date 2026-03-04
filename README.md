# Fungi_2

Репозиторий для реализации новой версии приложения Fungi.

## Единая документация

- Основной источник документации: `docs/` (MkDocs).
- Быстрый старт: `docs/getting-started/index.md`.
- Backend API и контракты: `docs/backend-api/index.md`.
- Процессы разработки: `docs/workflow/index.md`.

## Быстрый запуск

```bash
docker compose up -d --build
```

## Важно для существующей БД

Если база уже была создана раньше (старый docker volume), после обновления backend нужно один раз применить upgrade-скрипты:

```bash
cat DBInit/2-upgrade-avatar.sql | docker exec -i fungi-db psql -U fungi -d FungiDB -p 5531
cat DBInit/3-upgrade-rbac.sql | docker exec -i fungi-db psql -U fungi -d FungiDB -p 5531
```

## Документация локально (Docker)

```bash
docker compose up fungi-docs
```
