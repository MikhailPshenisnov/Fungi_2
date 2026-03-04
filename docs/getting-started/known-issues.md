# Известные проблемы

Актуально на 2 марта 2026.

## Backend / Environment

- Локальная сборка backend требует .NET SDK 7.x (проект таргетит `net7.0`).
- При установленном только .NET 6 возможна ошибка `NETSDK1045` во время `dotnet build`.

## Документация

- Публикация docs в GitHub Pages пока не включена.
- Текущий режим: локальный запуск docs через Docker (`fungi-docs`) + CI-проверка сборки на Pull Request.

## Mobile integration

- Для `ValidateToken` обязателен заголовок `Authorization: Bearer <token>`.
- Токен в `body` для `ValidateToken` больше не поддерживается.

## Frontend rewrite

- В rewrite-клиенте используется гибридная модель сессии:
  - без `Запомнить меня`: токен только в runtime-памяти, после `F5` пользователь выйдет из сессии;
  - с `Запомнить меня`: токен сохраняется в `localStorage`, сессия восстанавливается при старте через `GET /Users/GetCurrentUserProfile`.
