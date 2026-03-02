# Журнал изменений

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
