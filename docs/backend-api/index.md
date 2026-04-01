# Backend API

Описание API-контракта и правил интеграции.

## Swagger / OpenAPI

- Live Swagger UI: `http://localhost:5000/swagger/index.html`
- Snapshot OpenAPI: `QuickStart/Fungi_api_swagger.json`
- Детали по источнику истины и обновлению snapshot: [OpenAPI и Swagger](openapi.md)

## Контракт валидации auth

`Authorization/RegisterUser`:

- `name`: 8..128 символов, только `a-zA-Z0-9_.-`
- `email`: валидный email, максимум 128 символов
- `password`: 8..32 символов, минимум 1 цифра, 1 заглавная буква, 1 строчная буква, 1 спецсимвол из набора `!@#$%^&*(),.?\"{}|<>`

`Authorization/LoginUser`:

- `email`: валидный email, максимум 128 символов
- `password`: 8..32 символов

## Контракт ошибок API

Все ошибки API возвращаются в формате `BaseResponse`:

```json
{
  "data": null,
  "errorMessage": {
    "errorCode": "string",
    "errorGroup": "string",
    "errorMessage": "string"
  }
}
```

Стабильные `errorCode`:

- `invalid_request` — ошибки валидации/конвертации запроса;
- `authorization_error` — нет/невалидный bearer-токен;
- `access_denied` — недостаточно прав;
- `not_found` — сущность не найдена;
- `conflict` — конфликт данных;
- `internal_server_error` — серверная ошибка;
- `http_error` — базовый HTTP fallback код для пустого ответа middleware.

HTTP-коды:

- `400` — ошибки валидации и формата запроса
- `401` — ошибки аутентификации
- `403` — недостаточно прав доступа
- `404` — сущность не найдена
- `409` — конфликт данных
- `500` — внутренняя ошибка сервера

## Security hardening (P0)

- `GET /Users/GetUser`:
  - доступ к чужому профилю только при праве `users.read`;
  - пользователь всегда может читать только свой профиль.
- `GET /Users/TestGetUsers`:
  - больше не публичный;
  - требует авторизацию и право `users.read`.
- `GET /Roles/TestGetRoles`:
  - больше не публичный;
  - требует авторизацию и право `rbac.roles.read`.

## Контракт авторизации (web + mobile)

- JWT для защищенных endpoint передается только через заголовок `Authorization: Bearer <token>`.
- `POST /Authorization/ValidateToken` использует bearer-токен из заголовка.
- Токен в `body` для `ValidateToken` не используется.
- Cookie `jwt_token` не должен использоваться клиентами как источник авторизации.

Пример:

```http
POST /Authorization/ValidateToken HTTP/1.1
Host: localhost:5000
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Legacy endpoint (не использовать в новых клиентах)

- `GET /Authorization/GetCurrentDataUser` считается legacy-методом.
- Для новых web/mobile клиентов использовать:
  - `GET /Users/GetCurrentUserProfile` для профиля текущего пользователя;
  - `POST /Authorization/ValidateToken` для проверки bearer-токена.

## RBAC: роли и права из БД

Доступ к защищенным endpoint теперь строится по permission-кодам, назначенным роли в БД.

Новые/актуальные ручки для управления правами ролей:

- `GET /Roles/GetAllPermissions` — получить список всех permission-кодов.
- `GET /Roles/GetRolePermissions?roleId=<guid>` — получить права конкретной роли.
- `PUT /Roles/SetRolePermissions` — полностью заменить набор прав роли.
  - body: `{ "roleId": "...", "permissionCodes": ["users.read", "rbac.roles.manage"] }`

`CreateRole/UpdateRole/DeleteRole` и операции управления пользователями также проверяются через permission-коды.
Базовые коды для админского управления:

- `rbac.roles.read`
- `rbac.roles.manage`
- `rbac.permissions.read`
- `users.read`
- `users.manage`
- `users.delete`

`RoleDto` в user/role-ответах содержит `permissions: string[]`.

## Контракт аватаров пользователя

Новые endpoint для работы с аватаром текущего пользователя:

- `POST /Users/UploadMyAvatar`:
  - авторизация: `Authorization: Bearer <token>`;
  - `Content-Type: multipart/form-data`;
  - поле формы: `avatar` (`IFormFile`);
  - сервер:
    - валидирует размер/тип/расширение;
    - декодирует изображение;
    - делает центрированный квадратный crop;
    - ресайзит до `512x512`;
    - сохраняет в `webp` (`q=80`);
  - возвращает `data.avatarUrl`.

- `DELETE /Users/DeleteMyAvatar`:
  - авторизация: `Authorization: Bearer <token>`;
  - идемпотентный endpoint;
  - возвращает:
    - `isDeleted = true`, если в профиле был установлен аватар;
    - `isDeleted = false`, если аватар уже отсутствовал;
  - после удаления `avatarUrl = null`.

- `GET /Users/GetCurrentUserProfile`:
  - авторизация: `Authorization: Bearer <token>`;
  - возвращает профиль текущего пользователя в `data.user`.

Ограничения загрузки (v1):

- max file size: `5MB`;
- допустимые MIME-типы: `image/jpeg`, `image/png`, `image/webp`;
- допустимые расширения: `.jpg`, `.jpeg`, `.png`, `.webp`;
- минимальная сторона исходника: `128px`;
- максимальная сторона исходника: `4096px`;
- максимальное общее число пикселей исходника: `16 000 000` (16 MP).

Публичная раздача:

- аватары отдаются backend как static files по URL вида:
  - `/media/avatars/{userId}/{file}.webp`.

Миграция БД для существующих инсталляций:

- обязательный шаг перед деплоем backend: последовательно применить:
  - `DBInit/2-upgrade-avatar.sql`;
  - `DBInit/3-upgrade-rbac.sql`;
  - `DBInit/4-upgrade-articles-workflow.sql`;
  - `DBInit/5-upgrade-mushrooms-workflow.sql`.
- `DBInit/3-upgrade-rbac.sql` создает таблицы `Permissions`/`RolePermissions` и baseline-набор прав.

## Контракт каталога грибов и лайков

Каталог и карточки грибов:

- `GET /Mushrooms/GetFilteredMushrooms`:
  - фильтрация по query-параметрам `PartOfName`, `Family`, `Eatable`, `RedBook`, `HasStem`, `Stem*`, `Cap*`;
  - DB-level фильтрация (без загрузки всех грибов в память);
  - поддержка сортировки: `Sort=name|likes`;
  - поддержка пагинации: `Page`, `PageSize`;
  - в ответе:
    - `mushrooms[].likesCount`;
    - `totalCount`, `page`, `pageSize`.
- `GET /Mushrooms/GetMushroom?MushroomId=<guid>`:
  - детальная карточка гриба для страницы `/mushrooms/:id`.
  - возвращает только опубликованный snapshot из `Mushrooms`.

Публичная видимость:

- в публичные ручки каталога попадают только записи из `Mushrooms`, где `IsArchived = false`;
- черновики и модерационные версии (`MushroomRevisions`) в публичную выдачу не попадают.

## Контракт editor workflow грибов (v1)

Статусы revision:

- `Draft`;
- `InReview`;
- `Published`;
- `Rejected`;
- `Archived`.

Editor/moderation endpoint-ы:

- `POST /Mushrooms/CreateDraft`
- `PUT /Mushrooms/UpdateDraft`
- `POST /Mushrooms/SubmitForReview`
- `POST /Mushrooms/ModerateMushroom` (`Approve/Reject`)
- `POST /Mushrooms/ArchiveMushroom`
- `GET /Mushrooms/GetMyDrafts`
- `GET /Mushrooms/GetMyMaterials`
- `GET /Mushrooms/GetModerationQueue`
- `GET /Mushrooms/GetEditorMushroom`

Основные правила:

- published-snapshot хранится в `Mushrooms`;
- редактирование и модерация происходят в `MushroomRevisions`;
- approve:
  - создаёт или обновляет published snapshot;
  - проставляет `SourceMushroomId` у revision;
- archive:
  - ставит revision в `Archived`;
  - скрывает published snapshot из каталога (`IsArchived = true`).
- для `ArchiveMushroom` доступ допускается при `content.mushrooms.archive` **или** `content.mushrooms.manage-any`;
- архивирование разрешено только для `Published/Rejected` revision (черновик и `InReview` архивировать нельзя).
- `decision` в `ModerateMushroomRequest` принимается строго строкой:
  - `"Approve"` или `"Reject"`;
  - числовые значения (`0/1/...`) отклоняются как `400 invalid_request`.

Legacy endpoint-ы (оставлены для совместимости, но закрыты purge-правом):

- `POST /Mushrooms/CreateMushroom` — deprecated;
- `PUT /Mushrooms/UpdateMushroom` — deprecated;
- `DELETE /Mushrooms/DeleteMushroom` — deprecated;
- все три требуют `content.mushrooms.purge`.

Лайки грибов:

- `GET /MushroomLikes/GetLikesCount/count?mushroomId=<guid>`:
  - возвращает текущее количество лайков гриба.
- `GET /MushroomLikes/HasUserLiked/user?mushroomId=<guid>`:
  - требует bearer-токен;
  - возвращает, поставил ли текущий пользователь лайк.
- `POST /MushroomLikes/ToggleLike?mushroomId=<guid>`:
  - требует bearer-токен;
  - переключает лайк текущего пользователя и возвращает `isLiked`.

Контракт лайков приведён к typed `BaseResponse<T>`:

- `ToggleLike` -> `data.isLiked`
- `GetLikesCount` -> `data.count`
- `HasUserLiked` -> `data.hasLiked`

Единообразие ошибок:

- для несуществующего `mushroomId` все likes endpoint-ы возвращают `404`.

Media для грибов:

- `POST /Mushrooms/UploadMushroomImage`:
  - bearer auth + `content.mushroom-media.write`;
  - `multipart/form-data`, поле `image`;
  - ответ: `mediaUrl`, `mediaPath`.
- `DELETE /Mushrooms/DeleteMushroomImage?MediaPath=...`:
  - bearer auth + `content.mushroom-media.write`;
  - ответ: `isDeleted`.

Публичная раздача media:

- static files по пути `/media/mushrooms/*`;
- backend storage: `Storage/mushrooms`.

Правило ссылок на изображения гриба:

- допускаются только:
  - абсолютные `http/https` URL;
  - внутренние пути вида `/media/mushrooms/...`.

Валидация upload (v1):

- размер до `8MB`;
- MIME: `image/jpeg`, `image/png`, `image/webp`;
- ext: `.jpg`, `.jpeg`, `.png`, `.webp`;
- min side: `128px`;
- max side: `4096px`;
- max pixels: `20MP`;
- итоговый формат: `webp`.

Ограничения и ожидания по клиентам:

- каталог доступен публично, без обязательной авторизации;
- операции `HasUserLiked` и `ToggleLike` для неавторизованного клиента должны приводить к `401`;
- web/mobile-клиенты должны обрабатывать `401` как завершение сессии и запрашивать повторный вход.

## Контракт статей: editor workflow (v1)

### Статусы статьи

- `Draft`;
- `InReview`;
- `Scheduled`;
- `Published`;
- `Rejected`;
- `Archived`.

### Публичные правила видимости

- `GET /Articles/GetFilteredArticles` возвращает только `Published` статьи с наступившей датой публикации (`PublishDate <= now`);
- `GET /Articles/GetArticle` в публичном сценарии также доступен только для уже опубликованных статей;
- `Draft/InReview/Rejected/Archived/Scheduled (до даты)` не попадают в публичную выдачу.
- фильтрация выполняется на уровне БД (без полного in-memory скана);
- `likesCount` для списка статей заполняется bulk-агрегацией, без N+1 на каждый элемент.

### Editor/moderation endpoint-ы

- `POST /Articles/CreateDraft`:
  - создаёт черновик текущего автора;
  - bearer auth + `content.articles.write`.
- `PUT /Articles/UpdateDraft`:
  - обновляет черновик;
  - owner или роль с `content.articles.manage-any`.
- `POST /Articles/SubmitForReview`:
  - переводит `Draft/Rejected -> InReview`.
- `POST /Articles/ModerateArticle`:
  - решение `Approve/Reject`;
  - `decision` принимается строго строкой `"Approve"` или `"Reject"` (числа отклоняются `400 invalid_request`);
  - при approve:
    - `Published`, если `PublishDate <= now`;
    - `Scheduled`, если дата в будущем.
- `POST /Articles/ArchiveArticle`:
  - бизнес-удаление через архивирование (`-> Archived`).
- `GET /Articles/GetMyDrafts`:
  - возвращает материалы текущего автора в статусах `Draft/Rejected/InReview`.
- `GET /Articles/GetMyMaterials`:
  - возвращает материалы текущего автора в статусах `Published/Scheduled/Archived`.
- `GET /Articles/GetModerationQueue`:
  - очередь статей в `InReview`.
- `GET /Articles/GetEditorArticle`:
  - полная editor-модель статьи для owner/manage-any/review ролей.

### Media endpoint-ы статей

- `POST /Articles/UploadArticleImage`:
  - `multipart/form-data`, поле `image`;
  - bearer auth + `content.article-media.write`;
  - response: `mediaUrl`, `mediaPath`.
- `DELETE /Articles/DeleteArticleImage?MediaPath=...`:
  - удаление файла по относительному пути;
  - bearer auth + `content.article-media.write`.

Валидация media (v1):

- размер файла до `8MB`;
- MIME: `image/jpeg`, `image/png`, `image/webp`;
- ext: `.jpg`, `.jpeg`, `.png`, `.webp`;
- min side: `128px`;
- max side: `4096px`;
- max pixels: `20MP`;
- итоговое сохранение: `webp`, публичный URL через `/media/articles/*`.

### Article likes и привязка грибов

- лайки:
  - `POST /ArticleLikes/ToggleLike?ArticleId=<guid>`;
  - `GET /ArticleLikes/GetLikesCount/count?ArticleId=<guid>`;
  - `GET /ArticleLikes/HasUserLiked/user?ArticleId=<guid>` (auth).
- связи статьи и грибов:
  - `GET /ArticleMushrooms/GetAllMushrooms?ArticleId=<guid>`;
  - `POST /ArticleMushrooms/AddMushroomToArticle?ArticleId=<guid>&MushroomId=<guid>`;
  - `DELETE /ArticleMushrooms/DeleteMushroomFromArticle?ArticleId=<guid>&MushroomId=<guid>`;
  - `PUT /ArticleMushrooms/ReplaceArticleMushrooms` (bulk replace).

### DTO и совместимость

- `ArticleDto` расширен полями lifecycle/audit:
  - `status`, `createdByUserId`, `updatedByUserId`, `createdAt`, `updatedAt`,
  - `submittedAt`, `publishedAt`, `reviewedAt`, `reviewedByUserId`, `reviewNote`, `archivedAt`,
  - `likesCount`.
- `EditorArticleDto` включает `linkedMushroomIds` + полный список параграфов.
- `DELETE /Articles/DeleteArticle` переведен в deprecated purge-сценарий:
  - используется только с `content.articles.purge`.

### Миграция и rollout

- для существующей БД обязательная последовательность:
  1. `DBInit/2-upgrade-avatar.sql`;
  2. `DBInit/3-upgrade-rbac.sql`;
  3. `DBInit/4-upgrade-articles-workflow.sql`;
  4. `DBInit/5-upgrade-mushrooms-workflow.sql`.
- `4-upgrade-articles-workflow.sql`:
  - добавляет поля lifecycle/audit для `Articles`;
  - backfill старых записей в `Published`;
  - seed новых permission-кодов workflow;
  - назначение owner старым статьям на SuperUser.
- `5-upgrade-mushrooms-workflow.sql`:
  - добавляет `IsArchived` в `Mushrooms`;
  - создает таблицы `MushroomRevisions` и `MushroomRevisionDoppelgangers`;
  - выполняет backfill опубликованных ревизий из текущего каталога;
  - seed permission-кодов workflow/media для грибов и role-permissions.
- в backend запущен background scheduler:
  - каждые `60s` переводит `Scheduled -> Published`, когда наступила дата.

## Changelog для mobile-команды (breaking changes)

- `POST /Authorization/ValidateToken`:
  - раньше: token мог передаваться в `body`;
  - теперь: token обязателен только в `Authorization: Bearer <token>`.
- Cookie `jwt_token` больше не используется как источник авторизации API.
- `Authorization/LoginUser` и `Authorization/RegisterUser` возвращают token в `data.token`, но не записывают auth-cookie.
- `Authorization/LogoutUser` для bearer-схемы stateless: сервер не очищает cookie, клиент удаляет локальный token сам.
- Для web-dev запусков с разными портами CORS в локальных окружениях поддерживает `localhost/127.0.0.1` без ручного добавления порта в репозиторий.
- `UserDto` больше не возвращает `PasswordHash` в публичных user-ответах (security fix).
