# Mobile

## Текущий стек

- React Native + Expo (`mobile-dev/`).
- Backend общий с web-клиентами.

## Базовые правила интеграции с API

- Использовать `Authorization: Bearer <token>` для защищенных запросов.
- `POST /Authorization/ValidateToken` не принимает token в body.
- `LogoutUser` в bearer-схеме stateless: клиент удаляет локальный token самостоятельно.

## Конфигурация окружения

- `baseURL` должен зависеть от среды запуска (эмулятор/устройство/web).
- Для локальной web-разработки CORS поддерживает `localhost/127.0.0.1`.

## Рекомендации по стабильности

- централизовать HTTP-клиент и обработку ошибок;
- держать единый формат хранения/очистки токена;
- не смешивать cookie-auth и bearer-auth в одном клиенте.

## Что обновлять при изменениях

- при смене backend auth/API-контракта синхронизировать mobile API-слой;
- фиксировать breaking changes в `docs/backend-api/index.md`.
