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

- [quickstart/fungi-api-swagger.json](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/quickstart/fungi-api-swagger.json)

Обновление snapshot:

```bash
curl -fsS http://localhost:5000/swagger/v1/swagger.json | jq -S . > quickstart/fungi-api-swagger.json.tmp
mv quickstart/fungi-api-swagger.json.tmp quickstart/fungi-api-swagger.json
```

## Правило сопровождения

- При изменении API (routes, DTO, auth contract, коды ответов) обновлять snapshot OpenAPI в том же Pull Request.
- Snapshot не редактируется вручную: только генерация из live Swagger.
- Если контракт меняется для клиентов, добавить запись в [docs/changelog/index.md](../changelog/index.md).
- В PR с API-изменениями обязательно:
  - приложить diff `quickstart/fungi-api-swagger.json`;
  - подтвердить соответствие `runtime <-> OpenAPI` (smoke или контрактные проверки).
- Для article workflow поддерживать синхронность Swagger ↔ runtime:
  - публичные endpoint-ы (`GetArticle`, `GetFilteredArticles`) в OpenAPI должны быть без bearer security;
  - защищенные endpoint-ы должны иметь bearer security на уровне операции;
  - request-схемы должны содержать актуальные `required` поля;
  - для workflow endpoint-ов должны быть явно описаны non-200 ответы (`400/401/403/404/409/500`, где применимо).
- Для mobile-ready favorites-контракта проверять, что в OpenAPI отражены:
  - `GET /ArticleLikes/GetMyFavoriteArticles`;
  - `GET /MushroomLikes/GetMyFavoriteMushrooms`;
  - bearer security на обеих операциях;
  - query-параметры `Page`/`PageSize` и их валидационные `400` ответы.
- `operationId` в текущем цикле не переименовывается (ограничение совместимости codegen клиентов).

## Текущий статус snapshot

- Snapshot `quickstart/fungi-api-swagger.json` синхронизирован с live backend (`http://localhost:5000/swagger/v1/swagger.json`) на 10 апреля 2026.
