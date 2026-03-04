# Журнал изменений

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

### Mobile

- зафиксирован актуальный контракт интеграции для profile/avatar endpoint-ов;
- подтверждено требование использовать только bearer-токен в `Authorization` заголовке.

### DevOps / Docs

- добавлен обязательный runbook для существующей БД: последовательный запуск `2-upgrade-avatar.sql` и `3-upgrade-rbac.sql`;
- синхронизирован `QuickStart/Fungi_api_swagger.json` с live Swagger.

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
