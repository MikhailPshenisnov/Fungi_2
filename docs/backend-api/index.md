# Backend API

Описание API-контракта и правил интеграции.

## Swagger / OpenAPI

- Live Swagger UI: `http://localhost:5000/swagger/index.html`
- Snapshot OpenAPI: [quickstart/fungi-api-swagger.json](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/quickstart/fungi-api-swagger.json)
- Детали по источнику истины и обновлению snapshot: [OpenAPI и Swagger](openapi.md)

## Контракт валидации auth

`Authorization/RegisterUser`:

- `name`: 8..128 символов, только `a-zA-Z0-9_.-`
- `email`: валидный email, максимум 128 символов
- `password`: 8..32 символов, минимум 1 цифра, 1 заглавная буква, 1 строчная буква, 1 спецсимвол из набора `!@#$%^&*(),.?\"{}|<>`
- `isUserAgreementAccepted`: обязательно `true`
- `isPersonalDataProcessingConsentAccepted`: обязательно `true`
- `userAgreementVersion`: обязательное значение `2026-04-21-v1`
- `personalDataProcessingConsentVersion`: обязательное значение `2026-04-21-v1`

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
- `registration_error` — ошибка регистрации (например, попытка `RegisterUser` при уже авторизованном пользователе);
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
  - требует bearer-авторизацию;
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
  - `DBInit/5-upgrade-mushrooms-workflow.sql`;
  - `DBInit/6-upgrade-mushroom-field-lengths.sql`;
  - `DBInit/7-upgrade-user-consents.sql`.
- `DBInit/3-upgrade-rbac.sql` создает таблицы `Permissions`/`RolePermissions` и baseline-набор прав.

## Контракт каталога грибов и лайков

Каталог и карточки грибов:

- `GET /Mushrooms/GetFilteredMushrooms`:
  - фильтрация по query-параметрам `PartOfName`, `Family`, `Eatable`, `RedBook`, `HasStem`, `Stem*`, `Cap*`;
  - DB-level фильтрация (без загрузки всех грибов в память);
  - поддержка сортировки: `Sort=name|likes`;
  - поддержка пагинации: `Page`, `PageSize`;
  - значения по умолчанию: `Page=1`, `PageSize=12`;
  - ограничение `PageSize`: `1..100`;
  - невалидные `Page/PageSize/Sort` возвращают `400 invalid_request`;
  - endpoint публичный (без `[Authorize]`);
  - в ответе:
    - `mushrooms[].likesCount`;
    - `totalCount`, `page`, `pageSize`.
  - в baseline-данных `Eatable` может быть `"Неизвестно"` (кроме `"Съедобный"`, `"Полусъедобный"`, `"Несъедобный"`).
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
- поле `decision` обязательно:
  - отсутствие/null отклоняется как `400 invalid_request`.

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

## Baseline грибов из CSV

- источник baseline: `DBInit/data/mushrooms.csv`;
- генератор SQL: `python3 DBInit/scripts/generate_mushrooms_seed.py`;
- артефакты генератора:
  - `DBInit/6-seed-mushrooms-csv.sql`;
  - `DBInit/6-replace-mushrooms-csv.sql`.
- текущая политика baseline (v1):
  - исключается строка `Тестовый гриб`;
  - дедуп по `Наименование` (берётся первое вхождение);
  - отбрасываются записи с невалидными stem-данными;
  - фото временно технические:
    - `HeaderPhotoLink = /media/mushrooms/placeholder.webp`;
    - `ExtraPhotoLinks = null`.

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

## Контракт избранного (mobile-ready)

Новые endpoint-ы для раздела `Избранное`:

- `GET /ArticleLikes/GetMyFavoriteArticles`
- `GET /MushroomLikes/GetMyFavoriteMushrooms`

Общие правила:

- оба endpoint требуют bearer-авторизацию (`Authorization: Bearer <token>`);
- пагинация через query-параметры:
  - `Page` (по умолчанию `1`);
  - `PageSize` (по умолчанию `12`);
  - `PageSize` ограничен диапазоном `1..100`;
- невалидные `Page/PageSize` (нулевые, отрицательные, нечисловые, выход за лимиты) возвращают `400 invalid_request`;
- сортировка результата: `LikeDate DESC` (сначала последние добавления в избранное).

Фильтры видимости:

- для `GetMyFavoriteArticles`:
  - возвращаются только статьи со статусом `Published`;
  - и только статьи, у которых `PublishDate <= now(UTC)`;
- для `GetMyFavoriteMushrooms`:
  - возвращаются только грибы, где `IsArchived = false`.

Назначение:

- контракт предназначен для клиентов web/mobile как источник данных экрана `Избранное`;
- route-алиасы frontend вида `/profile/favorites` являются UI-навигацией и не заменяют API-контракт.

## Контракт статей: editor workflow (v1)

Полный операционный контракт публикации статей вынесен в отдельный runbook:

- [Runbook публикации статей (mobile/web)](articles-publication-runbook.md)

Кратко:

- публичные endpoint-ы чтения:
  - `GET /Articles/GetFilteredArticles` (только `Published` и `PublishDate <= now(UTC)`);
  - `GET /Articles/GetArticle`;
- editor/moderation workflow:
  - `CreateDraft -> UpdateDraft (0..N) -> SubmitForReview -> ModerateArticle (Approve/Reject) -> ArchiveArticle`;
- media:
  - `POST /Articles/UploadArticleImage`;
  - `DELETE /Articles/DeleteArticleImage`;
- legacy article endpoint-ы (`CreateArticle/UpdateArticle/DeleteArticle`) оставлены только для совместимости и не используются в новых клиентах.

### Миграция и rollout

- единый канонический checklist upgrade-скриптов и локального rollout описан в [Быстрый старт](../getting-started/index.md);
- background scheduler:
  - каждые `60s` переводит `Scheduled -> Published`, когда наступила дата.

## Changelog для mobile/backend команд

- единый канонический журнал клиентских API-изменений ведется в [docs/changelog/index.md](../changelog/index.md);
- backend-api/mobile разделы содержат только текущий контракт и ссылки на changelog-записи, без дублирования истории изменений.
