# Документация Fungi

Единая точка входа в документацию проекта Fungi.

## Для кого эта документация

- разработчики backend/frontend/mobile;
- участники, которые подключаются к проекту впервые;
- ревьюеры и тимлид для проверки контрактов и процесса.

## Навигация

- **Быстрый старт**: как поднять проект и документацию локально.
- **Архитектура**: обзор структуры репозитория и взаимодействия модулей.
- **Backend API**: контракты API, auth/cors правила, OpenAPI.
- **Frontend**: структура веб-клиента и правила работы с UI.
- **Mobile**: интеграция мобильного клиента с backend API.
- **Процессы разработки**: ветвление, PR, правила обновления docs.
- **Журнал изменений**: зафиксированные изменения по релизам/периодам.

## Статус ревизии контента

Актуально на 1 апреля 2026:

- auth/cors контракт синхронизирован с backend;
- OpenAPI snapshot обновлен из live Swagger;
- добавлена документация по каталогу грибов, деталке и лайк-сценариям;
- добавлен полный workflow статей: draft/review/publish/archive + editor endpoints;
- закрыт P0 backend hardening:
  - string-only moderation decision;
  - `errorCode` в API-ошибках;
  - security-ограничения для `GetUser` и `Test*` endpoint-ов;
  - integration regression-тесты backend;
- добавлены frontend-маршруты `/articles`, `/articles/:id`, `/editor/*` и их описание;
- зафиксировано Storybook-покрытие новых mushroom-компонентов;
- зафиксировано Storybook-покрытие article/editor сценариев;
- onboarding и workflow оформлены в отдельных разделах;
- зафиксированы текущие known issues.

См. также: [Известные проблемы](getting-started/known-issues.md).
