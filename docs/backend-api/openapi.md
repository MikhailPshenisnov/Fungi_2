# OpenAPI и Swagger

## Источник истины API

Источник API-контракта:

- код backend + swagger-аннотации;
- актуальный OpenAPI JSON, который отдает backend.

## Live ссылки

- Swagger UI: `http://localhost:5000/swagger/index.html`
- OpenAPI JSON: `http://localhost:5000/swagger/v1/swagger.json`

## Snapshot в репозитории

Для фиксации состояния контракта используется snapshot:

- `QuickStart/Fungi_api_swagger.json`

Обновление snapshot:

```bash
curl -fsS http://localhost:5000/swagger/v1/swagger.json -o QuickStart/Fungi_api_swagger.json
```

## Правило сопровождения

- При изменении API (routes, DTO, auth contract, коды ответов) обновлять snapshot OpenAPI в том же Pull Request.
- Если контракт меняется для клиентов, обязательно добавить короткий changelog для frontend/mobile команд.

## Текущий статус snapshot

- Snapshot `QuickStart/Fungi_api_swagger.json` синхронизирован с live backend (`http://localhost:5000/swagger/v1/swagger.json`) на 4 марта 2026.
