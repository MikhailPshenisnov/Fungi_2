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
    "errorGroup": "string",
    "errorMessage": "string"
  }
}
```

Коды ошибок:

- `400` — ошибки валидации и формата запроса
- `401` — ошибки аутентификации
- `403` — недостаточно прав доступа
- `404` — сущность не найдена
- `409` — конфликт данных
- `500` — внутренняя ошибка сервера

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

## Changelog для mobile-команды (breaking changes)

- `POST /Authorization/ValidateToken`:
  - раньше: token мог передаваться в `body`;
  - теперь: token обязателен только в `Authorization: Bearer <token>`.
- Cookie `jwt_token` больше не используется как источник авторизации API.
- `Authorization/LoginUser` и `Authorization/RegisterUser` возвращают token в `data.token`, но не записывают auth-cookie.
- `Authorization/LogoutUser` для bearer-схемы stateless: сервер не очищает cookie, клиент удаляет локальный token сам.
- Для web-dev запусков с разными портами CORS в локальных окружениях поддерживает `localhost/127.0.0.1` без ручного добавления порта в репозиторий.
