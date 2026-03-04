# Mobile

## Текущий стек

- React Native + Expo (`mobile-dev/`).
- Backend общий с web-клиентами.

## Базовые правила интеграции с API

- Использовать `Authorization: Bearer <token>` для защищенных запросов.
- `POST /Authorization/ValidateToken` не принимает token в body.
- `LogoutUser` в bearer-схеме stateless: клиент удаляет локальный token самостоятельно.

## Профиль и аватар (актуальный контракт)

- `GET /Users/GetCurrentUserProfile`:
  - источник данных текущего пользователя для мобильного профиля;
  - возвращает `user.role.permissions: string[]` для role-aware UI.
- `POST /Users/UploadMyAvatar`:
  - `multipart/form-data`, поле `avatar`;
  - по успеху возвращает `avatarUrl`.
- `DELETE /Users/DeleteMyAvatar`:
  - идемпотентное удаление аватара;
  - возвращает `isDeleted` и `avatarUrl = null` после удаления.

Рекомендуемый поток:

- login/register -> сохранить bearer token;
- `GET /Users/GetCurrentUserProfile` -> построить user session;
- upload/delete avatar -> обновить локальный профиль по `avatarUrl`.

## Каталог грибов и лайки (актуальный контракт)

- `GET /Mushrooms/GetFilteredMushrooms`:
  - получить список грибов с фильтрами (поиск, семейство, съедобность, red book).
- `GET /Mushrooms/GetMushroom?MushroomId=<guid>`:
  - получить полную карточку гриба для detail-screen.
- `GET /MushroomLikes/GetLikesCount/count?mushroomId=<guid>`:
  - количество лайков гриба (публичный endpoint).
- `GET /MushroomLikes/HasUserLiked/user?mushroomId=<guid>`:
  - только для авторизованного пользователя.
- `POST /MushroomLikes/ToggleLike?mushroomId=<guid>`:
  - только для авторизованного пользователя.

Рекомендуемый mobile-поток:

- гость может смотреть каталог и карточки грибов без авторизации;
- при попытке лайка без токена показывать CTA на login/register;
- при `401` на `HasUserLiked/ToggleLike` считать сессию истекшей и переводить пользователя в auth-flow.

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
