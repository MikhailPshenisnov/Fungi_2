# Журнал изменений

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

- `QuickStart/Fungi_api_swagger.json` обновлен по актуальному backend Swagger.
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
- синхронизирован `QuickStart/Fungi_api_swagger.json` с live Swagger.
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
