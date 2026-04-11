# Журнал изменений

## 2026-04-10

### Backend

- добавлен mobile-ready контракт `Избранное`:
  - `GET /ArticleLikes/GetMyFavoriteArticles`;
  - `GET /MushroomLikes/GetMyFavoriteMushrooms`;
  - auth required (bearer);
  - пагинация `Page/PageSize` (defaults `1/12`, max `100`, invalid -> `400 invalid_request`);
  - сортировка `LikeDate DESC`;
  - visibility-фильтры:
    - статьи: только `Published` и `PublishDate <= now(UTC)`;
    - грибы: только `IsArchived = false`.
- синхронизирован OpenAPI-контракт статей с runtime:
  - для `Articles/*` добавлены явные `ProducesResponseType` с non-200 ответами;
  - уточнена схема required-полей в article request DTO;
  - security в Swagger переведена на per-operation режим:
    - публичные `GetArticle/GetFilteredArticles` отображаются как anonymous;
    - защищенные article endpoint-ы отображаются с bearer requirement.

### Mobile

- зафиксирован сценарий интеграции favorites для mobile-клиента:
  - загрузка избранных статей и грибов через новые likes endpoint-ы;
  - единая обработка `401` как истечения сессии;
  - уточнение, что `/profile/favorites` — UI redirect web-клиента, а не API.

### DevOps / Docs

- добавлен отдельный runbook публикации статей для web/mobile:
  - [docs/backend-api/articles-publication-runbook.md](../backend-api/articles-publication-runbook.md);
  - зафиксированы state machine, пошаговый flow, матрица прав, примеры payload/response, known issues.
- выполнен docs-pass по связности и каноническим источникам:
  - breaking/client-impact изменения централизованы через [docs/changelog/index.md](index.md);
  - upgrade-checklist для существующей БД закреплен в [docs/getting-started/index.md](../getting-started/index.md).
- обновлены ссылки и краткие разделы в:
  - [docs/backend-api/index.md](../backend-api/index.md);
  - [docs/mobile/index.md](../mobile/index.md);
  - [docs/backend-api/openapi.md](../backend-api/openapi.md);
  - `mkdocs.yml` (nav).
- синхронизирован [quickstart/fungi-api-swagger.json](https://github.com/MikhailPshenisnov/Fungi_2/blob/HEAD/quickstart/fungi-api-swagger.json) после обновления Swagger-контракта.

## 2026-04-07

### Frontend

- добавлены browser smoke/e2e тесты на Playwright (`frontend/tests/e2e/workflows`):
  - `auth` (login/logout);
  - `catalog` (грибы -> детальная);
  - `profile`;
  - `likes`;
  - `editor workflows` (статьи и грибы).
- в `frontend/package.json` добавлены скрипты:
  - `e2e`;
  - `e2e:smoke`;
  - `e2e:headed`.

### DevOps / Docs

- в корне репозитория подключен git-quality контур:
  - `husky`;
  - `lint-staged`;
  - `commitlint` + Conventional Commits.
- добавлены конфиги и хуки:
  - `.lintstagedrc.cjs`;
  - `commitlint.config.cjs`;
  - `.husky/pre-commit`;
  - `.husky/commit-msg`.
- CI workflow расширен job `e2e-smoke`:
  - подъем `fungi-db + fungi-backend`;
  - ожидание readiness backend;
  - запуск `npm --prefix frontend run e2e:smoke`;
  - публикация Playwright artifacts.
- выполнен high-impact naming batch (без `mobile-dev`):
  - `QuickStart/` -> `quickstart/`;
  - `quickstart/QuickStart.md` -> `quickstart/README.md`;
  - `quickstart/Fungi_api_swagger.json` -> `quickstart/fungi-api-swagger.json`;
  - `DBBackups/Фикс ошибки при загрузке бэкапа.txt` -> `DBBackups/backup-restore-fix.md`;
  - `frontend/FOUNDATION_README.md` -> `frontend/docs/foundation-readme.md`.
- обновлены ссылки на OpenAPI snapshot и quickstart пути по документации.
- зафиксировано решение по локализации: `RU-only` (без внедрения i18n-библиотеки на этапе P2).

## 2026-04-06

### Backend

- baseline грибов переведен с моков на импорт из CSV:
  - добавлен источник `DBInit/data/mushrooms.csv`;
  - добавлен генератор `DBInit/scripts/generate_mushrooms_seed.py`;
  - добавлены SQL-артефакты `DBInit/6-seed-mushrooms-csv.sql` и `DBInit/6-replace-mushrooms-csv.sql`.
- активный `1-mock-data.sql` очищен от старых моковых вставок грибов/ревизий/лайков;
- для существующих БД добавлен upgrade `DBInit/6-upgrade-mushroom-field-lengths.sql`;
- расширены лимиты полей грибов в схеме/EF/моделях:
  - `SynonymousName: 128 -> 256`;
  - `StemColor: 64 -> 256`;
  - `CapColor: 64 -> 256`.
- `Eatable` расширен новым допустимым значением `"Неизвестно"` (используется для CSV baseline).

### Frontend

- в форме редактора грибов добавлено значение съедобности `"Неизвестно"` в списке вариантов.

### DevOps / Docs

- обновлены runbook-инструкции по БД в `README.md`:
  - добавлен `6-upgrade-mushroom-field-lengths.sql`;
  - добавлен one-time импорт `6-replace-mushrooms-csv.sql`;
  - добавлена команда генерации seed из CSV.
- обновлена `docs/backend-api/index.md`:
  - зафиксирован CSV baseline и правила нормализации;
  - добавлен апгрейд `6-upgrade-mushroom-field-lengths.sql`;
  - отражено значение `Eatable = "Неизвестно"`.

## 2026-04-04

### Frontend

- добавлены component tests для `shared/ui/primitives`:
  - `Button`, `Input`, `Select`, `Checkbox`, `Typography`;
- Storybook конфиг расширен `@storybook/addon-vitest`;
- добавлен отдельный скрипт `npm run test:components` и включен в frontend quality-gates.

### DevOps / Docs

- добавлен единый GitHub Actions workflow `.github/workflows/ci.yml`:
  - `frontend` (`lint`, `typecheck`, `stories:check`, `storybook:build`, `test:components`);
  - `backend` (`dotnet restore/build/test`);
  - `docs` (`mkdocs build --strict`);
- удален дублирующий workflow `docs-ci.yml` (docs-проверка перенесена в общий CI);
- добавлен `global.json` с фиксацией .NET SDK `7.0.410` (`rollForward: latestPatch`);
- `docker-compose.yml` актуализирован:
  - `fungi-frontend` переведен на rewrite-клиент `./frontend`;
  - `fungi-docs` вынесен в профиль `docs` (не запускается по умолчанию);
- зафиксирован legacy freeze для `frontend_fungi`:
  - папка оставлена в репозитории как архив;
  - исключена из runtime/compose/CI;
  - документация обновлена под rewrite-only контур.

## 2026-04-02

### DevOps / Docs

- добавлена отдельная страница матрицы Storybook-покрытия: `docs/frontend/storybook-coverage.md`;
- в Storybook-документацию добавлен раздел `coverage matrix` с процессом:
  - генерация матрицы через `npm run stories:coverage`;
  - проверка актуальности через `npm run stories:coverage:check`;
  - валидация через `stories:check`, `storybook:build`, `storybook:check`;
  - правила обновления при изменениях stories/title/state-наборов/page-flow.
- добавлены ссылки на `docs/frontend/storybook-coverage.md` в:
  - `docs/frontend/index.md`;
  - `docs/frontend/storybook.md`;
  - `frontend/docs/STORYBOOK.md`;
  - `frontend/README.md`.
- `stories:check` расширен: теперь проверяет наличие stories не только в `shared/ui`, но и в `pages/widgets/features/entities` (для директорий `ui` с TSX-компонентами).
- унифицированы Storybook `title` в `shared/ui`:
  - `Shared/UI/Primitives/*`;
  - `Shared/UI/Composites/*`.
- добавлена история `Pages/Search/SearchPage` для полного прохождения `stories:check`.

## 2026-04-01

### Backend

- закрыт P0-контракт модерации:
  - `ModerateArticle` и `ModerateMushroom` принимают `decision` только строкой (`Approve/Reject`);
  - числовые enum-значения для `decision` отклоняются с `400`.
- усилен security-контур:
  - `GetUser` для чужого профиля теперь требует `users.read`;
  - `Users/TestGetUsers` и `Roles/TestGetRoles` закрыты авторизацией и permission-check.
- `GetFilteredArticles` переведен на DB-level фильтрацию и публичную выборку без in-memory full-scan.
- `GetFilteredArticles` расширен серверной пагинацией и сортировкой:
  - query: `Page`, `PageSize`, `Sort`;
  - response: `totalCount`, `page`, `pageSize`.
- убран N+1 для likesCount статей:
  - в backend добавлена bulk-агрегация лайков для списка статей.
- унифицирован контракт ошибок:
  - `ExceptionDto` расширен полем `errorCode`;
  - `errorCode` протянут через model validation, exception middleware и HTTP status middleware.
- добавлен отдельный integration test проект backend:
  - `xUnit + WebApplicationFactory + PostgreSQL Testcontainers`;
  - покрыты workflow/RBAC/security/contract/error-regression сценарии.
- из production-сборки backend исключены файлы `tests/**`, чтобы test project не попадал в `BackendFungi.csproj`.
- секреты и дефолтные креды удалены из `appsettings*.json`:
  - заменены на безопасные placeholder-значения с env override.

### Frontend

- закрыт frontend P0 по каталогам:
  - `/articles` и `/mushrooms` переведены на серверную пагинацию/сортировку (`page/pageSize/sort/totalCount`);
  - удален client-side full-scan и локальная сортировка больших списков.
- добавлен рабочий глобальный поиск из `AppHeader`:
  - submit в header ведет на `/search?q=...`;
  - новая страница `/search` объединяет результаты статей и грибов.
- введен общий UI-компонент состояний `ContentState` и применен в ключевых экранах
  (каталоги, детали, профильные preview, editor-списки/очереди/формы).
- реализован отдельный editor workflow для грибов в rewrite-клиенте:
  - `/editor/mushrooms` (`scope=drafts|materials`);
  - `/editor/mushrooms/new`;
  - `/editor/mushrooms/:revisionId/edit`;
  - `/editor/mushrooms/review`.
- добавлен отдельный API-слой `features/mushroom-editor`:
  - `getMyDrafts`, `getMyMaterials`, `getModerationQueue`, `getEditorMushroom`;
  - `createDraft`, `updateDraft`, `submitForReview`, `moderateMushroom`, `archiveMushroom`;
  - `uploadMushroomImage`, `deleteMushroomImage`.
- добавлены permission-коды и guard-матрица для mushroom editor:
  - list/new/edit: any of `content.mushrooms.write|manage-any|review|publish|archive`;
  - review: any of `content.mushrooms.review|publish`.
- в профиль и dropdown header добавлены грибные вкладки:
  - `mushroom-materials`, `mushroom-drafts`, `mushroom-moderation`;
  - отображение строго по permission-набору.
- `ProfilePage` обновлен:
  - вместо заглушек добавлен реальный предпросмотр плиток ревизий грибов;
  - быстрые переходы на `/editor/mushrooms*` из соответствующих вкладок.
- в форме ревизии гриба:
  - draft можно сохранить без обложки;
  - `headerPhotoLink` обязателен только при `SubmitForReview`;
  - добавлена человекочитаемая нормализация legacy-ошибок валидации.
- добавлено Storybook-покрытие:
  - `EditorMushroomsPage`;
  - `EditorMushroomFormPage`;
  - `EditorMushroomReviewPage`.

### DevOps / Docs

- обновлены `docs/frontend/index.md` и `frontend/README.md`:
  - новые mushroom editor маршруты;
  - permission-guard политика;
  - описание workflow ревизий и модерации грибов.
- обновлены `README.md`, `.env.example` и `docs/getting-started/index.md`:
  - запуск через `.env` с backend-secrets/env overrides;
  - актуализирован список обязательных DB upgrade-скриптов до `5-upgrade-mushrooms-workflow.sql`.
- `BackendFungi/Dockerfile` переведен на publish только `BackendFungi.csproj` (без публикации test-проектов в runtime-образ).
- обновлены `docs/backend-api/index.md` и `docs/mobile/index.md`:
  - string-only `decision` для moderation endpoint-ов;
  - `errorCode` в контракте ошибок;
  - security-ограничения для user/test endpoint-ов.
- повторно синхронизированы `docs/frontend/index.md` и `frontend/README.md`:
  - добавлен маршрут `/search` и глобальный поиск из `AppHeader` (`/search?q=...`);
  - зафиксирован переход каталогов `/articles` и `/mushrooms` на server-side pagination/sort;
  - зафиксирован общий компонент состояний `ContentState`.
- отдельно актуализирована документация Storybook:
  - расширен `frontend/docs/STORYBOOK.md` (runbook, quality gates, providers/decorators, troubleshooting);
  - добавлена страница `docs/frontend/storybook.md` и ссылка на нее в `mkdocs.yml`;
  - обновлены Storybook-разделы в `frontend/README.md` и `docs/frontend/index.md`.
- синхронизирован `quickstart/fungi-api-swagger.json` из live Swagger после P0 backend-фиксов.

## 2026-03-29

### Backend

- завершен backend workflow редактирования грибов через `MushroomRevisions`:
  - `Draft -> InReview -> Published/Rejected/Archived`;
  - опубликованный каталог читает только snapshot из `Mushrooms`.
- добавлены editor/moderation endpoint-ы для грибов:
  - `POST /Mushrooms/CreateDraft`;
  - `PUT /Mushrooms/UpdateDraft`;
  - `POST /Mushrooms/SubmitForReview`;
  - `POST /Mushrooms/ModerateMushroom`;
  - `POST /Mushrooms/ArchiveMushroom`;
  - `GET /Mushrooms/GetMyDrafts`;
  - `GET /Mushrooms/GetMyMaterials`;
  - `GET /Mushrooms/GetModerationQueue`;
  - `GET /Mushrooms/GetEditorMushroom`.
- усилен публичный каталог грибов:
  - DB-level фильтрация (`PartOfName/Family/Eatable/RedBook/...`);
  - исправлен `Eatable`-фильтр;
  - добавлены optional `page/pageSize/sort=name|likes`;
  - в `GetFilteredMushrooms` добавлены `totalCount/page/pageSize` и `mushrooms[].likesCount`.
- `MushroomLikesController` переведен на typed-контракты `ActionResult<BaseResponse<T>>`;
- поведение likes для несуществующего `mushroomId` выровнено на единый `404`.
- добавлен media-контур грибов:
  - `POST /Mushrooms/UploadMushroomImage`;
  - `DELETE /Mushrooms/DeleteMushroomImage`;
  - публичная раздача через `/media/mushrooms/*`.
- legacy `DELETE /Mushrooms/DeleteMushroom` помечен deprecated и ограничен правом `content.mushrooms.purge`.
- legacy `POST /Mushrooms/CreateMushroom` и `PUT /Mushrooms/UpdateMushroom` также закрыты правом `content.mushrooms.purge`
  (чтобы не обходить revision/moderation workflow).
- `ArchiveMushroom` выровнен по RBAC:
  - доступ допускается при `content.mushrooms.archive` **или** `content.mushrooms.manage-any`.
- workflow-запросы (`GetMyDrafts/GetMyMaterials/GetModerationQueue/GetEditorMushroom`) переведены с full-scan на целевые DB-запросы.
- добавлен DB hardening для `MushroomRevisions`:
  - `CHECK`-ограничение на допустимые значения `Status`;
  - partial unique index для одной `Published` revision на `SourceMushroomId`.
- валидация ссылок изображений гриба сужена до:
  - `http/https`;
  - внутренний путь только `/media/mushrooms/*`.
- обновлены SQL-скрипты:
  - восстановлен/актуализирован `DBInit/0-db-init.sql`;
  - обновлен `DBInit/1-mock-data.sql`;
  - добавлен `DBInit/5-upgrade-mushrooms-workflow.sql`.
- в docker-compose для backend добавлен volume:
  - `fungi_backend_mushrooms` -> `/app/Storage/mushrooms`.

### DevOps / Docs

- обновлена backend-документация `docs/backend-api/index.md`:
  - новый workflow грибов;
  - media-контракт грибов;
  - обновленный контракт каталога/лайков и поведение 404.

## 2026-03-11

### Frontend

- внедрён единый глобальный toast-слой ошибок в rewrite-клиенте:
  - `ToastProvider`, `ToastViewport`, `useToast`;
  - desktop-позиция снизу справа, mobile-позиция снизу по центру.
- реализована механика UX уведомлений:
  - стек до `3` элементов;
  - автоскрытие `4s`;
  - пауза таймера на hover/focus;
  - дедупликация одинаковых ошибок в окне `3s`.
- страницы auth/editor/profile/public каталоги переведены с inline/error-card канала на toast как основной канал ошибок.
- на страницах со списками/деталями сохранены нейтральные fallback-блоки с `Повторить` без агрессивного error-оформления.
- в editor-форме статьи добавлена нормализация backend-валидации в человекочитаемые русские тексты
  (включая кейс `Extra photo links must contain at least one link or be null`).
- вкладки профиля `Черновики` и `Мои материалы` переведены с текстовой заглушки на компактные плитки статей
  с кнопками действий (`Редактировать`, `Открыть весь список`, `Создать статью`).
- вкладка профиля `Модерация` переведена на плитки статей
  (с метаданными и быстрыми переходами к материалу/очереди).
- обновлена валидация article workflow:
  - для `Draft` обложка больше не обязательна;
  - при `SubmitForReview` / approve обложка обязательна;
  - `extraPhotoLinks` может быть пустым без ошибки.

### DevOps / Docs

- Storybook preview обновлён: `ToastProvider` подключён глобально для историй, использующих `useToast`.
- документация `docs/frontend/index.md` и `frontend/README.md` дополнена разделом про глобальные toast-ошибки и их поведение.

## 2026-03-10

### Backend

- внедрен полный lifecycle статей:
  - статусы `Draft`, `InReview`, `Scheduled`, `Published`, `Rejected`, `Archived`;
  - публичная выдача ограничена только опубликованными и доступными по дате статьями.
- добавлены editor/moderation endpoint-ы:
  - `POST /Articles/CreateDraft`;
  - `PUT /Articles/UpdateDraft`;
  - `POST /Articles/SubmitForReview`;
  - `POST /Articles/ModerateArticle`;
  - `POST /Articles/ArchiveArticle`;
  - `GET /Articles/GetMyDrafts`;
  - `GET /Articles/GetMyMaterials`;
  - `GET /Articles/GetModerationQueue`;
  - `GET /Articles/GetEditorArticle`.
- добавлен media-контур статей:
  - `POST /Articles/UploadArticleImage`;
  - `DELETE /Articles/DeleteArticleImage`;
  - публичная раздача через `/media/articles/*`.
- добавлен scheduler публикации:
  - background service переводит `Scheduled -> Published` по времени.
- добавлены typed-контракты для `ArticleLikes` и `ArticleMushrooms`, включая bulk replace связей:
  - `PUT /ArticleMushrooms/ReplaceArticleMushrooms`.
- `DeleteArticle` переведен в purge-сценарий (deprecated для бизнес-flow).
- добавлена миграция `DBInit/4-upgrade-articles-workflow.sql` и обновлены `DBInit/0-db-init.sql`, `DBInit/1-mock-data.sql`.
- в docker-compose для backend добавлен отдельный volume для article media:
  - `fungi_backend_articles` -> `/app/Storage/articles`.

### Frontend

- добавлены маршруты статей:
  - `/articles`;
  - `/articles/:id`.
- добавлен editor workspace:
  - `/editor/articles` (`scope=drafts|materials`);
  - `/editor/articles/new`;
  - `/editor/articles/:id/edit`;
  - `/editor/review`.
- реализована страница детальной статьи:
  - paragraph-render, галерея, связанные грибы, лайки.
- реализован frontend workflow редактора:
  - создание/обновление черновика;
  - отправка на модерацию;
  - архивирование;
  - модерация (approve/reject + note).
- реализован upload изображений статьи с прогрессом в editor-форме.
- profile/header интегрированы с editor flow:
  - `Статьи` в header ведет на `/articles`;
  - role-specific переходы из профиля и dropdown ведут на `/editor/*`;
- добавлен popup авторизации для лайков в article-сценариях:
  - `Features/Articles/AuthRequiredPopup`.

### Mobile

- задокументирован совместимый контракт по новым article endpoint-ам;
- зафиксировано, что mobile UI в этой итерации не меняется, но backend endpoint-ы готовы к интеграции.

### DevOps / Docs

- `quickstart/fungi-api-swagger.json` обновлен по актуальному backend Swagger.
- обновлены разделы документации:
  - `docs/backend-api/index.md` — workflow статей, media, миграции;
  - `docs/frontend/index.md` — новые маршруты `/articles` и `/editor/*`;
  - `docs/mobile/index.md` — контракт совместимости article API;
  - `frontend/README.md` — описание editor flow и guard-политики.
- добавлено Storybook-покрытие новых страниц/компонентов:
  - `ArticleDetailPage`;
  - `EditorArticlesPage`;
  - `EditorArticleFormPage`;
  - `EditorReviewPage`;
  - `Features/Articles/AuthRequiredPopup`.

### Breaking changes

- `ArticleDto` расширен lifecycle/audit-полями и `likesCount`;
- `GET /Articles/GetFilteredArticles` теперь не возвращает непубличные статусы;
- бизнес-удаление статьи переведено на `ArchiveArticle`, физическое удаление — только purge-flow.

## 2026-03-04

### Backend

- добавлены endpoint-ы для аватара текущего пользователя:
  - `POST /Users/UploadMyAvatar`;
  - `DELETE /Users/DeleteMyAvatar`;
  - `GET /Users/GetCurrentUserProfile`;
- реализована серверная обработка аватара (валидация, квадратный crop, resize `512x512`, сохранение в `webp`);
- добавлено хранение `AvatarPath` в таблице `Users` и SQL upgrade-скрипт `DBInit/2-upgrade-avatar.sql`;
- включена публичная раздача аватаров через `/media/avatars/*`;
- внедрен RBAC на permission-кодах из БД (`Permissions`/`RolePermissions`);
- добавлены endpoint-ы управления правами ролей:
  - `GET /Roles/GetAllPermissions`;
  - `GET /Roles/GetRolePermissions`;
  - `PUT /Roles/SetRolePermissions`;
- `RoleDto` расширен полем `permissions: string[]`;
- добавлен SQL upgrade-скрипт `DBInit/3-upgrade-rbac.sql`;
- обновлены OpenAPI snapshot и backend-документация.

### Frontend

- role-aware UI переведен на permission-коды из `user.role.permissions`;
- role-specific вкладки профиля и пункты dropdown зависят от прав роли, а не от client-side хардкода групп;
- добавлена поддержка `Запомнить меня`:
  - с включенным флагом токен сохраняется в `localStorage`;
  - сессия восстанавливается на старте через `GET /Users/GetCurrentUserProfile`.
- добавлена отдельная страница «О нас» (`/about`) с пользовательской структурой контента;
- пункт `О нас` в header переведен с якоря `/#about` на отдельный маршрут `/about`;
- улучшена читаемость блока контактов и финального CTA на странице «О нас»:
  - повышен контраст текста;
  - усилена контрастность вторичной кнопки.
- добавлена отдельная страница каталога грибов `/mushrooms`:
  - URL-sync фильтров и сортировки (`q`, `family`, `eatable`, `redBook`, `sort`, `page`);
  - layout `sticky-сайдбар + сетка карточек`;
  - клиентская пагинация по 12 карточек.
- добавлена детальная карточка гриба `/mushrooms/:id`:
  - hero-блок, морфология, галерея и список двойников;
  - обратная навигация в каталог с сохранением query через `backTo`.
- реализованы лайки в каталоге и на деталке:
  - optimistic toggle + rollback при ошибке;
  - popup для гостя с CTA `Регистрироваться`/`Позже`;
  - обработка `401` через `signOut` и редирект на `/login`.
- UX каталога обновлен:
  - лайк-кнопка в карточке переведена в icon-only формат (`favorite-icon`) со счетчиком;
  - состояния `liked/unliked` визуально разделены (цвет/фон/рамка);
  - вся карточка гриба сделана кликабельной, кнопка `Подробнее` удалена.
- навигация `Грибы` в header и кнопка `Все грибы` на лендинге переведены на маршрут `/mushrooms`.

### Mobile

- зафиксирован актуальный контракт интеграции для profile/avatar endpoint-ов;
- подтверждено требование использовать только bearer-токен в `Authorization` заголовке.

### DevOps / Docs

- добавлен обязательный runbook для существующей БД: последовательный запуск `2-upgrade-avatar.sql` и `3-upgrade-rbac.sql`;
- синхронизирован `quickstart/fungi-api-swagger.json` с live Swagger.
- расширена документация:
  - backend-api: контракт каталога грибов и лайков;
  - frontend/mobile: маршруты `/mushrooms`, detail-flow, guest-like сценарий;
  - Storybook: зафиксировано покрытие `MushroomsPage`, `MushroomDetailPage`, `AuthRequiredPopup`.

### Breaking changes

- `UserDto` больше не содержит `PasswordHash`;
- в `UserDto` добавлено поле `avatarUrl`.

## 2026-03-03

### Frontend

- добавлена страница профиля и маршруты `/profile`, `/profile/favorites`, `/profile/history`;
- после успешного входа и регистрации настроен редирект на `/profile`;
- в `AppHeader` добавлено выпадающее меню профиля с пунктами:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`;
  - `Выйти`.
- переходы в header переведены на client-side routing без full reload;
- якорные ссылки header направлены на главную страницу (`/#top`, `/#about`, ...), чтобы корректно работать с любых маршрутов.

## 2026-03-02

### Backend

- унифицирован auth-контракт под bearer-схему;
- `ValidateToken` переведен на `Authorization: Bearer <token>`;
- удалена legacy-схема передачи token в body;
- обновлен CORS для локальной разработки (localhost/127.0.0.1 без коммита портов);
- обновлены Swagger/OpenAPI и сопроводительная документация.

### Документация

- внедрен каркас MkDocs (`mkdocs.yml`, `docs/`);
- оформлены разделы: quickstart, architecture, backend api, frontend, mobile, workflow;
- добавлена CI-проверка сборки docs на Pull Request;
- добавлен раздел known issues и правила сопровождения документации.

## Формат последующих записей

Использовать секции:

- `Backend`
- `Frontend`
- `Mobile`
- `DevOps / Docs`
- `Breaking changes`

Каждая запись должна содержать дату и краткое описание изменения.
