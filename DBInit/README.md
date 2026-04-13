# DBInit

Ниже самый простой способ применить все upgrade-скрипты разом для уже существующей БД.

## Быстрый запуск (рекомендуется)

Из корня проекта:

```bash
docker compose up -d fungi-db
bash DBInit/run-upgrades.sh
```

Скрипт сам:

- берет `DB_USER`, `DB_NAME`, `DB_PORT` из `.env` (если файл есть);
- применяет скрипты по порядку:
  - `2-upgrade-avatar.sql`
  - `3-upgrade-rbac.sql`
  - `4-upgrade-articles-workflow.sql`
  - `5-upgrade-mushrooms-workflow.sql`
  - `6-upgrade-mushroom-field-lengths.sql`

## Если нужно также заменить baseline грибов из CSV

```bash
bash DBInit/run-upgrades.sh --with-csv-replace
```

Это дополнительно выполнит `6-replace-mushrooms-csv.sql`.

## Полезно

Справка по параметрам:

```bash
bash DBInit/run-upgrades.sh --help
```
