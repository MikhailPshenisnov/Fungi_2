Репозиторий для реализации новой версии приложения для проекта "Fungi" с нуля

## Запуск Docker

В корне репозитория (предварительно запустив Docker Desktop):

```
docker-compose up --build -d
```

## Контракт валидации auth

Для `Authorization/RegisterUser`:

- `name`: 8..128 символов, только `a-zA-Z0-9_.-`
- `email`: валидный email, максимум 128 символов
- `password`: 8..32 символов, минимум 1 цифра, 1 заглавная, 1 строчная, 1 спецсимвол из набора `!@#$%^&*(),.?\"{}|<>`

Для `Authorization/LoginUser`:

- `email`: валидный email, максимум 128 символов
- `password`: 8..32 символов

## Контракт ошибок API

Ошибки API возвращаются в едином формате `BaseResponse`:

```json
{
  "data": null,
  "errorMessage": {
    "errorGroup": "string",
    "errorMessage": "string"
  }
}
```

Базовые коды:

- `400` — ошибки валидации и формата входных данных
- `401` — ошибки аутентификации
- `403` — недостаточно прав
- `404` — сущность не найдена
- `409` — конфликт данных (например, уникальность)
- `500` — внутренняя ошибка сервера

## Контракт авторизации (web + mobile)

- JWT для защищенных endpoint передается только через заголовок `Authorization: Bearer <token>`.
- `POST /Authorization/ValidateToken` использует текущий bearer-токен из заголовка.
- Токен в `body` для `ValidateToken` не используется.
- Cookie `jwt_token` не должен использоваться клиентами как источник авторизации.

Пример запроса:

```http
POST /Authorization/ValidateToken HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
