# TODO

## Статус

- Обновлено: 4 марта 2026.
- Фокус текущей ветки: `frontend` rewrite + hardening backend + документация.
- Все закрытые крупные этапы фиксируем в `docs/changelog/index.md`, а не держим как активный backlog.

## P0 — Ближайший спринт

### Frontend (rewrite)

- [ ] Убрать хардкод контента на лендинге (`грибы`, `публикации`) и подгружать данные с backend API.
- [ ] Привести ключевые экраны к единым состояниям `loading/empty/error` (лендинг, каталог, детальная карточка, профиль).

### Backend (security)

- [ ] Закрыть IDOR в `UpdateUserSmallParam`: обновление профиля только для текущего пользователя.
- [ ] Ограничить/закрыть `Test*` и слабозащищенные user-endpoint-ы (`GetUser`, `TestGetUsers`) по permission/role policy.
- [ ] Убрать секреты и дефолтные креды из `appsettings*.json` в env/secrets (`JWT key`, пароль дефолтного superuser).

### Product/Legal

- [ ] Добавить реальные страницы: политика конфиденциальности, пользовательское соглашение, обработка ПДн.
- [ ] Сделать обязательный consent checkbox со ссылками на документы в регистрации.

## P1 — Следующий этап

### Frontend

- [ ] Сделать рабочий глобальный поиск в `AppHeader` (роутинг + выдача + интеграция с API).
- [ ] Подключить `@storybook/addon-vitest` и добавить component tests для `shared/ui` (`Button`, `Input`, `Select`, `Checkbox`, `Typography`).
- [ ] Подготовить план миграции legacy `frontend_fungi` экранов в rewrite и деактивации mock-fallback в production.

### Backend

- [ ] Привести `ArticleLikes` / `MushroomLikes` / `ArticleMushrooms` к единому контракту (`ActionResult<T>`, typed DTO).
- [ ] Убрать небезопасные обращения к первому элементу без проверки (`[0]`) в контроллерах.
- [ ] Финализировать очистку auth-legacy: убрать остатки cookie-зависимых сценариев из API для новых клиентов.

### DevOps / Docs

- [ ] Настроить CI pipeline: frontend (`lint`, `typecheck`, `design:lint`, `build`, `storybook:build`), backend build, docs build.
- [ ] Настроить публикацию документации (GitHub Pages/Netlify/Vercel) и добавить ссылку в `README.md`.
- [ ] Добавить `global.json` для фиксации версии .NET SDK.

## P2 — Улучшения

- [ ] Подключить Husky + lint-staged + commitlint (Conventional Commits).
- [ ] Привести нейминг файлов/папок к единому стандарту по всему репозиторию.
- [ ] Добавить базовые e2e/smoke тесты для критических сценариев (`auth`, `catalog`, `profile`, `likes`).
- [ ] Принять решение по i18n (RU-first / RU+EN) и зафиксировать roadmap локализации.

## Архив закрытых направлений

- [x] Фикс бэка для мобилки: bearer-only validate token + CORS dev-flow + синхронизация контракта.
- [x] Внедрение MkDocs-базы документации.
- [x] Backend-first подготовка аватаров + frontend avatar flow.
- [x] Страница `Грибы` (`/mushrooms`) + детальная карточка (`/mushrooms/:id`) + лайки + docs/storybook.
