# Журнал изменений

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
