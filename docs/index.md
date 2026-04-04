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
- **Frontend / Storybook**: runbook по запуску, проверкам и правилам stories.
- **Frontend / Storybook Coverage**: актуальная матрица покрытия и контроль отсутствующих stories.
- **Mobile**: интеграция мобильного клиента с backend API.
- **Процессы разработки**: ветвление, PR, правила обновления docs.
- **Журнал изменений**: зафиксированные изменения по релизам/периодам.

## Статус ревизии контента

Актуально на 4 апреля 2026:

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
- добавлен frontend-маршрут `/search` и обновлён глобальный поиск из header;
- каталоги `/articles` и `/mushrooms` переведены на серверную пагинацию/сортировку;
- Storybook-документация вынесена в отдельный runbook-раздел (запуск, quality gates, troubleshooting);
- добавлена автогенерируемая матрица Storybook-покрытия и проверки её актуальности;
- добавлен единый CI workflow (frontend/backend/docs) с quality-gates;
- `frontend_fungi` переведен в архивный статус (runtime работает на rewrite `frontend/`);
- в `shared/ui/primitives` добавлены component tests и подключен `@storybook/addon-vitest`;
- onboarding и workflow оформлены в отдельных разделах;
- зафиксированы текущие known issues.

См. также: [Известные проблемы](getting-started/known-issues.md).
