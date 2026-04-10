# Runbook публикации статей (mobile/web)

Документ фиксирует фактический runtime-контракт публикации статей и правила интеграции для web/mobile.

Источник истины:

- backend-код: [ArticlesController](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/BackendFungi/Controllers/ArticlesController.cs), [ArticlesService](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/BackendFungi/Services/ArticlesService.cs), [ArticleFilter](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/BackendFungi/Models/Filters/ArticleFilter.cs), [ArticleMediaStorageService](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/BackendFungi/Services/ArticleMediaStorageService.cs);
- OpenAPI snapshot: [quickstart/fungi-api-swagger.json](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/quickstart/fungi-api-swagger.json);
- правила синхронизации OpenAPI: [backend-api/openapi.md](openapi.md).

## 1) State machine статусов

Статусы статьи:

- `Draft`
- `InReview`
- `Scheduled`
- `Published`
- `Rejected`
- `Archived`

Переходы в текущем API:

- `CreateDraft` -> `Draft`
- `UpdateDraft` сохраняет текущий статус (доступно для `Draft|Rejected|Published|Scheduled`, но для `Published` только при `content.articles.manage-any`)
- `SubmitForReview`: `Draft|Rejected` -> `InReview`
- `ModerateArticle` + `decision=Approve`:
  - `InReview` -> `Published`, если `PublishDate <= now(UTC)`
  - `InReview` -> `Scheduled`, если `PublishDate > now(UTC)`
- `ModerateArticle` + `decision=Reject`: `InReview` -> `Rejected`
- `ArchiveArticle`: допустимый текущий статус -> `Archived`
- background scheduler (каждые `60s`): `Scheduled` -> `Published`, когда наступила дата публикации

## 2) Пошаговый flow публикации

### Шаг 0. Media (опционально)

- `POST /Articles/UploadArticleImage` (`multipart/form-data`, поле `image`)
- `DELETE /Articles/DeleteArticleImage?MediaPath=...`
- auth: bearer + `content.article-media.write`
- ответ upload: `mediaUrl`, `mediaPath`

### Шаг 1. Создание черновика

- `POST /Articles/CreateDraft`
- auth: bearer + `content.articles.write`
- результат: `createdArticleId`, `status=Draft`

Пример:

```json
{
  "title": "Сморчки весной",
  "publishDate": "2026-04-10T12:00:00Z",
  "authorString": "Редакция Fungi",
  "headerPhotoLink": "/media/articles/2026/04/cover.webp",
  "extraPhotoLinks": ["/media/articles/2026/04/extra-1.webp"],
  "paragraphs": [
    {
      "text": "Сморчки появляются ранней весной.",
      "isSubtitle": false
    }
  ],
  "linkedMushroomIds": []
}
```

### Шаг 2. Редактирование черновика (0..N раз)

- `PUT /Articles/UpdateDraft`
- auth: bearer + `content.articles.write`
- ownership: owner или `content.articles.manage-any`
- `linkedMushroomIds`:
  - `null` или отсутствует поле -> текущие привязки не меняются
  - `[]` -> все привязки очищаются
  - `[id1,id2,...]` -> полный replace привязок

Пример:

```json
{
  "articleId": "f43b9c57-b8f1-4a16-9559-d77fe3e8ab10",
  "title": "Сморчки весной: безопасный сбор",
  "publishDate": "2026-04-12T09:30:00Z",
  "authorString": "Редакция Fungi",
  "headerPhotoLink": "/media/articles/2026/04/cover-v2.webp",
  "extraPhotoLinks": [
    "/media/articles/2026/04/extra-1.webp",
    "/media/articles/2026/04/extra-2.webp"
  ],
  "paragraphs": [
    {
      "text": "Важно отличать сморчки от похожих видов.",
      "isSubtitle": false
    }
  ],
  "linkedMushroomIds": ["f2f5e27a-e2f8-48ce-a045-1fdb4900fa4f"]
}
```

### Шаг 3. Отправка на модерацию

- `POST /Articles/SubmitForReview`
- auth: bearer + `content.articles.write`
- ownership: owner или `content.articles.manage-any`
- бизнес-валидность: только `Draft|Rejected`
- precondition: `headerPhotoLink` обязателен (пустой -> `400 invalid_request`)
- результат: `status=InReview`, `submittedAt`

### Шаг 4. Модерация

- `POST /Articles/ModerateArticle`
- auth: bearer + `content.articles.review`
- `decision`:
  - канонические значения: `Approve` или `Reject`
  - backend принимает регистр-независимо (`approve`, `APPROVE` и т.п.)
  - любые нестроковые значения (например `0/1`) -> `400 invalid_request`
- при `Approve`:
  - `Published`, если дата уже наступила
  - иначе `Scheduled`
- при `Reject`: `Rejected`
- precondition для approve: `headerPhotoLink` обязателен

### Шаг 5. Архивирование (бизнес-удаление)

- `POST /Articles/ArchiveArticle`
- auth: bearer + `content.articles.archive`
- ownership: owner или `content.articles.manage-any`
- результат: `status=Archived`, `archivedAt`

## 3) Матрица endpoint / auth / permission / ownership

| Endpoint                              | Auth         | Permission                    | Правило доступа                                                 |
| ------------------------------------- | ------------ | ----------------------------- | --------------------------------------------------------------- |
| `GET /Articles/GetFilteredArticles`   | не требуется | нет                           | только публичные `Published` c `PublishDate <= now`             |
| `GET /Articles/GetArticle`            | не требуется | нет                           | только публичная статья                                         |
| `GET /Articles/GetEditorArticle`      | bearer       | `content.articles.write`      | базово нужен `write`, затем owner или `manage-any` или `review` |
| `GET /Articles/GetMyDrafts`           | bearer       | `content.articles.write`      | только текущий пользователь                                     |
| `GET /Articles/GetMyMaterials`        | bearer       | `content.articles.write`      | только текущий пользователь                                     |
| `GET /Articles/GetModerationQueue`    | bearer       | `content.articles.review`     | очередь `InReview`                                              |
| `POST /Articles/CreateDraft`          | bearer       | `content.articles.write`      | без ownership-ограничения                                       |
| `PUT /Articles/UpdateDraft`           | bearer       | `content.articles.write`      | owner или `manage-any`                                          |
| `POST /Articles/SubmitForReview`      | bearer       | `content.articles.write`      | owner или `manage-any`                                          |
| `POST /Articles/ModerateArticle`      | bearer       | `content.articles.review`     | без ownership-ограничения                                       |
| `POST /Articles/ArchiveArticle`       | bearer       | `content.articles.archive`    | owner или `manage-any`                                          |
| `POST /Articles/UploadArticleImage`   | bearer       | `content.article-media.write` | поле `image` обязательно                                        |
| `DELETE /Articles/DeleteArticleImage` | bearer       | `content.article-media.write` | удаление по `mediaPath`                                         |

## 4) Ошибки и обработка

Формат ошибки:

```json
{
  "data": null,
  "errorMessage": {
    "errorCode": "invalid_request",
    "errorGroup": "Validation error",
    "errorMessage": "The Decision field is required."
  }
}
```

Типовые коды:

- `400 invalid_request`:
  - невалидный payload/query;
  - недопустимый статусный переход;
  - `decision` нестрока/неизвестное значение;
  - отсутствует `headerPhotoLink` перед `SubmitForReview`/`Approve`;
  - media upload не проходит ограничения валидации.
- `401 authorization_error`: отсутствует/битый bearer-токен.
- `403 access_denied`: нет permission или ownership-доступа.
- `404 not_found`: неизвестный `articleId` или отсутствующая сущность.
- `409 conflict`: конфликт доменных ограничений (например, уникальность).
- `500 internal_server_error`: серверная ошибка.

Рекомендованная обработка на клиенте:

- `401` -> сбросить локальную сессию и перейти в auth-flow.
- `403` -> показать "нет доступа" без ретрая.
- `400` -> отобразить `errorMessage.errorMessage` пользователю.

## 5) Время публикации и DateTime контракт

- Рекомендуемый формат для клиентов: ISO-8601 с timezone (`...Z` или `+03:00`).
- Основные статусные переходы и scheduler используют `DateTime.UtcNow`.
- Публичная видимость (`GetArticle`, `GetFilteredArticles`): только `Published` и `PublishDate <= now`.
- `ModerateArticle(Approve)` с будущей датой -> `Scheduled`.
- Scheduler проверяет `Scheduled` статьи каждые `60` секунд, поэтому публикация может произойти с задержкой до ~60 секунд.
- as-is нюанс фильтра: валидация `PublishDateFrom` в `ArticleFilter` сравнивает с `DateTime.Now` (локальное серверное время), а не с UTC.

## 6) Media-контракт статей

Ограничения upload (`POST /Articles/UploadArticleImage`):

- размер файла: до `8MB`;
- MIME: `image/jpeg`, `image/png`, `image/webp`;
- расширения: `.jpg`, `.jpeg`, `.png`, `.webp`;
- минимальная сторона: `128px`;
- максимальная сторона: `4096px`;
- максимум пикселей: `20 000 000`;
- выходной формат хранения: `webp` (`quality=82`, max side `1600px`);
- публичный URL: `/media/articles/*`.

Важно:

- для удаления использовать query-параметр `MediaPath` (значение из `upload.data.mediaPath`), а не `mediaUrl`.

## 7) Legacy endpoint-ы (mobile не использовать)

Legacy endpoint-ы оставлены для совместимости, но для mobile запрещены:

- `POST /Articles/CreateArticle`
- `PUT /Articles/UpdateArticle`
- `DELETE /Articles/DeleteArticle` (purge)

Для mobile/web интеграции использовать только workflow:

- `CreateDraft`
- `UpdateDraft`
- `SubmitForReview`
- `ModerateArticle`
- `ArchiveArticle`

## 8) Known issues / as-is

В этом цикле runtime не меняется, ниже зафиксировано текущее поведение:

- `content.articles.publish` присутствует как permission-code, но не участвует в текущих проверках контроллеров.
- `GetEditorArticle` сначала требует `content.articles.write`; роль только с `content.articles.review` без `write` не пройдет первичную проверку.
- В `CreateDraft/UpdateDraft` привязка `linkedMushroomIds` выполняется после сохранения статьи: при ошибке привязки статья уже создана/обновлена.
- В `GetFilteredArticles` при запросе страницы больше `totalPages` в ответе `page` может быть уменьшен, но `articles` остаются пустыми (as-is).
- `RebuildArticle` использует null-coalescing для workflow-полей; часть значений может сохраняться, даже если бизнес-ожидание было на очистку.
- `operationId` в OpenAPI намеренно не переименовывается в этом цикле (совместимость codegen клиентов).
