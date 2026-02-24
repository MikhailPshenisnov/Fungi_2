# TODO

## Backlog by Category

- P0 — критично и срочно. Блокирует релиз/демо, ломает ключевой функционал, высокий риск.
- P1 — важно, но не блокер “прямо сейчас”. Делается после P0.
- P2 — полезные улучшения, можно отложить.
- P3 — nice-to-have / низкий приоритет.

### Frontend

#### P0

- [ ] Убрать хардкод контента на главной и подгружать статьи/грибы с бэка. Главная сейчас рендерит статичные массивы публикаций/грибов ([`PublicationsBanner.tsx:9`](frontend_fungi/src/pages/main-page/components/publications-banner/PublicationsBanner.tsx#L9), [`MushroomBanner.tsx:8`](frontend_fungi/src/pages/main-page/components/mushroom-banner/MushroomBanner.tsx#L8)).
- [ ] Ограничить fallback на mock-данные: оставить для dev, отключить для прода. Сейчас пользователь может вручную загрузить mock в рабочих экранах ([`PublicationsPage.tsx:80`](frontend_fungi/src/pages/Publications/components/publications-page/PublicationsPage.tsx#L80), [`index.tsx:79`](frontend_fungi/src/pages/Encyclopedia/index.tsx#L79)). Для прода это надо закрыть.

#### P1

- [ ] Доработать поиск: глобальный поиск в хедере + улучшение фильтра/поиска в энциклопедии. Сейчас глобальный поиск в хедере — это просто `form action="/search"` без рабочей интеграции с роутером/API ([`SearchBar.tsx:5`](frontend_fungi/src/modules/Header/search-bar/SearchBar.tsx#L5)), а маршрута `/search` в роутере нет ([`AppRouter.tsx:17`](frontend_fungi/src/app/router/AppRouter.tsx#L17)). В энциклопедии поиск и фильтрация локальные, с ручными маппингами, которые требуют ревизии/унификации ([`index.tsx:58`](frontend_fungi/src/pages/Encyclopedia/index.tsx#L58), [`MushroomFilter.tsx:24`](frontend_fungi/src/pages/Encyclopedia/components/MushroomFilter/MushroomFilter.tsx#L24)).
- [ ] [frontend-new] Вторая итерация foundation: подключить `@storybook/addon-vitest` и добавить component tests для `shared/ui` (минимум `Button`, `Input`, `Select`, `Checkbox`, `Typography`). Цель: проверка интеракций, состояний (`default/disabled/error`) и базовой доступности в story-тестах.

- [ ] Привести profile page к рабочему и визуально завершенному состоянию. Сейчас страница профиля использует временные решения: триггер-перезагрузку через `proverka` ([`ProfilePage.tsx:15`](frontend_fungi/src/pages/profile-page/ProfilePage.tsx#L15)), debug-лог в эффекте ([`ProfilePage.tsx:18`](frontend_fungi/src/pages/profile-page/ProfilePage.tsx#L18)), `alert` вместо нормального UI-feedback ([`ProfilePage.tsx:46`](frontend_fungi/src/pages/profile-page/ProfilePage.tsx#L46)), и не имеет нормальных loading/disabled-состояний при submit ([`ProfilePage.tsx:26`](frontend_fungi/src/pages/profile-page/ProfilePage.tsx#L26)). В CSS есть ошибочный селектор в mobile-блоке ([`ProfilePage.css:112`](frontend_fungi/src/pages/profile-page/ProfilePage.css#L112)).

- [ ] Убрать костыли/legacy-код на фронте, почистить дубли и лишние `console.log`. На фронте много debug-логов в рабочих компонентах ([`header.tsx:21`](frontend_fungi/src/modules/Header/header/header.tsx#L21), [`index.tsx:27`](frontend_fungi/src/app/layout/index.tsx#L27), [`PublicationsPage.tsx:42`](frontend_fungi/src/pages/Publications/components/publications-page/PublicationsPage.tsx#L42), [`AdminPage.tsx:72`](frontend_fungi/src/pages/admin-page/AdminPage.tsx#L72), [`SortDropdown.tsx:13`](frontend_fungi/src/pages/Components/SortDropdown/index.tsx#L13)). Также в API слое смешаны `axios` и `fetch`, что усложняет поддержку и обработку ошибок ([`AppApi.ts:5`](frontend_fungi/src/api/AppApi.ts#L5), [`AppApi.ts:170`](frontend_fungi/src/api/AppApi.ts#L170)).

### Backend

#### P0

Открытых задач P0 сейчас нет

#### P1

- [ ] Пройтись по TODO в бэке и закрыть безопасные доработки без переписывания архитектуры. В серверном коде много незакрытых TODO в контроллерах и конфигурации приложения ([`Program.cs:151`](BackendFungi/Program.cs#L151), [`AuthorizationController.cs:17`](BackendFungi/Controllers/AuthorizationController.cs#L17), [`UsersController.cs:31`](BackendFungi/Controllers/UsersController.cs#L31), [`UsersController.cs:241`](BackendFungi/Controllers/UsersController.cs#L241), [`RolesController.cs:30`](BackendFungi/Controllers/RolesController.cs#L30), [`ArticleLikesController.cs:19`](BackendFungi/Controllers/ArticleLikesController.cs#L19), [`MushroomLikesController.cs:19`](BackendFungi/Controllers/MushroomLikesController.cs#L19), [`ArticleMushroomsController.cs:24`](BackendFungi/Controllers/ArticleMushroomsController.cs#L24), [`ArticleMushroomsController.cs:32`](BackendFungi/Controllers/ArticleMushroomsController.cs#L32)).
- [ ] Убрать/заменить временные методы-костыли (`Test*`, `GetCurrentDataUser`) по согласованному плану миграции. Костыльные методы есть в API ([`UsersController.cs:41`](BackendFungi/Controllers/UsersController.cs#L41), [`RolesController.cs:40`](BackendFungi/Controllers/RolesController.cs#L40), [`AuthorizationController.cs:220`](BackendFungi/Controllers/AuthorizationController.cs#L220), [`UsersController.cs:251`](BackendFungi/Controllers/UsersController.cs#L251)), но фронт сейчас на них завязан ([`AppApi.ts:122`](frontend_fungi/src/api/AppApi.ts#L122), [`AppApi.ts:153`](frontend_fungi/src/api/AppApi.ts#L153), [`AppApi.ts:186`](frontend_fungi/src/api/AppApi.ts#L186), [`AppApi.ts:214`](frontend_fungi/src/api/AppApi.ts#L214)). Поэтому удалять их можно только после замены вызовов на нормальные endpoints и проверки совместимости.
- [ ] Привести likes/article-mushrooms контроллеры к единому контракту запросов/ответов. Для `ArticleLikes`, `MushroomLikes`, `ArticleMushrooms` нет типизированных request/response DTO и используется `IActionResult` с ad-hoc объектами ([`ArticleLikesController.cs:31`](BackendFungi/Controllers/ArticleLikesController.cs#L31), [`MushroomLikesController.cs:31`](BackendFungi/Controllers/MushroomLikesController.cs#L31), [`ArticleMushroomsController.cs:41`](BackendFungi/Controllers/ArticleMushroomsController.cs#L41)); в самих файлах зафиксирован TODO перейти на `ActionResult<>` и добавить контракты ([`ArticleLikesController.cs:19`](BackendFungi/Controllers/ArticleLikesController.cs#L19), [`MushroomLikesController.cs:19`](BackendFungi/Controllers/MushroomLikesController.cs#L19), [`ArticleMushroomsController.cs:24`](BackendFungi/Controllers/ArticleMushroomsController.cs#L24)).
- [ ] Пересмотреть стратегию авторизации (cookies -> token/localStorage) с учетом web + mobile сценариев. Сейчас схема смешанная: бэк пишет JWT в cookie ([`AuthorizationController.cs:51`](BackendFungi/Controllers/AuthorizationController.cs#L51), [`AuthorizationController.cs:126`](BackendFungi/Controllers/AuthorizationController.cs#L126)), читает его из cookie в текущих методах ([`AuthorizationController.cs:146`](BackendFungi/Controllers/AuthorizationController.cs#L146), [`AuthorizationController.cs:222`](BackendFungi/Controllers/AuthorizationController.cs#L222)), при этом CORS настроен через `AllowCredentials` и сам помечен как проблемный ([`Program.cs:149`](BackendFungi/Program.cs#L149), [`Program.cs:151`](BackendFungi/Program.cs#L151)). На фронте одновременно используются `Bearer`-заголовки для части запросов ([`AppApi.ts:164`](frontend_fungi/src/api/AppApi.ts#L164), [`AppApi.ts:197`](frontend_fungi/src/api/AppApi.ts#L197)), что подтверждает необходимость единой auth-стратегии.

### UX/UI and Design

#### P0

- [ ] Свести страницы `login/register/profile` к единому стилю по макетам дизайнеров.
- [ ] Уменьшить визуальную высоту хедера и улучшить его адаптивное поведение.
- [ ] Добавить полноценный адаптив (mobile/tablet/desktop) для ключевых страниц.
- [ ] Добавить консистентные `loading/empty/error` состояния на ключевые экраны.

#### P1

- [ ] Согласовать единые дизайн-токены (типографика, цвета, отступы, состояния компонентов).
- [ ] Проверить базовую доступность (контраст, фокус, размеры кликабельных элементов).

### Product, Legal, Content

#### P0

- [ ] Добавить реальные страницы: политика конфиденциальности, пользовательское соглашение, обработка ПДн.
- [ ] Сделать реальную проверку согласия с политикой/ПДн при регистрации (required checkbox + ссылки на документы).
- [ ] Проверить замечание "нет регистрации пользователя": подтвердить фактический статус, исправить баги если есть.

#### P1

- [ ] Подготовить контент-план и приоритизировать наполнение контентом на семестр.

### DevOps, Quality, Process

#### P1

- [ ] Настроить CI (frontend lint/build, backend build, docker compose config/health checks).
- [ ] Добавить базовые тесты (минимум smoke/e2e happy path на критические сценарии).
- [ ] Подключить Husky + lint-staged + commitlint + Conventional Commits.
- [ ] Добавить фронт в Docker (dev/prod сценарий) и описать запуск.
- [ ] Привести нейминг файлов/папок к единому стандарту.
- [ ] Переписать README: быстрый старт, архитектура, окружения, known issues, troubleshooting.
- [ ] .env на гите, убрать
- [ ] [backend] После завершения локальной отладки CORS убрать временный origin `http://localhost:5174` из `Frontend:AllowedOrigins` и оставить только постоянные адреса окружений.

## Undistributed

- [ ] [backend] Закрыть IDOR в обновлении профиля: `UpdateUserSmallParam` принимает `UserEmail` из формы и обновляет первого найденного пользователя, что позволяет менять данные не своего аккаунта при знании email ([`UsersController.cs:251`](BackendFungi/Controllers/UsersController.cs#L251), [`UsersController.cs:267`](BackendFungi/Controllers/UsersController.cs#L267), [`UsersController.cs:289`](BackendFungi/Controllers/UsersController.cs#L289), [`UpdateUserRequestSmallParam.cs:3`](BackendFungi/Contracts/Requests/UsersRequests/UpdateUserRequestSmallParam.cs#L3)).
- [ ] [backend] Убрать утечку `PasswordHash` из API-контрактов пользователей: поле присутствует в `UserDto` и отдается в `GetUser`/`GetFilteredUsers` ([`UserDto.cs:7`](BackendFungi/Contracts/Other/UserDto.cs#L7), [`UsersController.cs:76`](BackendFungi/Controllers/UsersController.cs#L76), [`UsersController.cs:117`](BackendFungi/Controllers/UsersController.cs#L117)).
- [ ] [backend] Ограничить доступ к `GetUser` (сейчас достаточно просто быть авторизованным) и закрыть/ограничить `TestGetUsers` (сейчас без `[Authorize]`, отдает список пользователей с email) ([`UsersController.cs:60`](BackendFungi/Controllers/UsersController.cs#L60), [`UsersController.cs:38`](BackendFungi/Controllers/UsersController.cs#L38), [`UsersController.cs:51`](BackendFungi/Controllers/UsersController.cs#L51)).
- [ ] [backend] Убрать небезопасные обращения к первому элементу без проверки (`filteredUsers[0]`): риск `IndexOutOfRange` и 500 при пустом результате фильтра ([`AuthorizationController.cs:270`](BackendFungi/Controllers/AuthorizationController.cs#L270), [`UsersController.cs:270`](BackendFungi/Controllers/UsersController.cs#L270)).
- [ ] [frontend] Починить сборку TypeScript (`npm run build` сейчас падает): неверная типизация API-ответов и ошибки nullable/union в ряде страниц ([`AppApi.ts:133`](frontend_fungi/src/api/AppApi.ts#L133), [`AppApi.ts:143`](frontend_fungi/src/api/AppApi.ts#L143), [`MushroomPage/index.tsx:71`](frontend_fungi/src/pages/Encyclopedia/components/MushroomPage/index.tsx#L71), [`PublicationPage.tsx:70`](frontend_fungi/src/pages/Publications/components/publication-page/PublicationPage.tsx#L70)).
- [ ] [frontend] Исправить невалидный inline-style в `HeaderNavLink` (`transition: 1` ломает типизацию `CSSProperties`) ([`HeaderNavLink.tsx:20`](frontend_fungi/src/modules/Header/header-nav-link/HeaderNavLink.tsx#L20)).
- [ ] [devops] Зафиксировать версию .NET SDK через `global.json` в корне (локальная сборка бэка падает с `NETSDK1045` при установленном .NET 6 и таргете `net7.0`) ([`BackendFungi.csproj:4`](BackendFungi/BackendFungi.csproj#L4)).
- [ ] [devops] Убрать секреты/дефолтные креды из `appsettings*.json` (JWT key и пароль дефолтного суперпользователя), вынести в переменные окружения/секрет-хранилище и ротировать значения ([`appsettings.json:13`](BackendFungi/appsettings.json#L13), [`appsettings.json:24`](BackendFungi/appsettings.json#L24), [`appsettings.Docker.json:13`](BackendFungi/appsettings.Docker.json#L13), [`appsettings.Docker.json:24`](BackendFungi/appsettings.Docker.json#L24)).

## Meeting agenda

- [ ] [frontend] Обсудить стратегию локализации: когда внедряем i18n, поддерживаемые языки (RU-first / RU+EN), требования к SEO/`lang` и влияние на текущий roadmap лендинга.
- [ ] [frontend] Header profile: поддержать аватар пользователя в `AppHeader` (показывать фото, если есть; fallback на `profile-icon`).
- [ ] [frontend] Header profile: реализовать dropdown-меню по клику на иконку профиля (профиль/настройки/выход).

## Отчёт по frontend rewrite (на 24.02.2026)

### Frontend

- [+] Вынесен URL бэка во фронте в `VITE_API_URL`, убран хардкод `localhost:5000`.
- [+] Исправлены битые/несуществующие роуты (`/public`, `/home`), навигация приведена в рабочее состояние.
- [+] Стабилизирован auth-поток на фронте (единая проверка текущего пользователя, корректный logout, уменьшены гонки состояния).
- [+] Улучшен UX регистрации/логина: loading-состояния, понятные ошибки, требования к паролю до отправки формы.
- [+] Сообщения в регистрации приведены к реальным правилам бэка (`username min 8`, password policy).
- [+] Исправлены несовпадения контрактов фронт-бэк в админке (`RoleId` vs `role` и related поля).
- [+] Развернута новая архитектура `frontend` (FSD-структура, aliases, провайдеры, роутинг, базовые правила).
- [+] Внедрён Storybook и зафиксированы правила использования (`README`, `docs/STORYBOOK.md`, `docs/CONTRIBUTING.md`).
- [+] Поднят foundation-слой: semantic tokens, typography scale, радиусы, тени, breakpoints, правила нейминга токенов.
- [+] Добавлены базовые primitives/composites и покрытие stories для публичных компонентов.
- [+] Добавлен `tokens overview` + проверка контрастов/AA в Storybook и исправлены выявленные проблемы по контрасту.
- [+] Реализованы quality-gates и скрипты: `design:lint`, `stories:check/sync`, `ui:index:sync`, `scaffold:ui`, `remove:ui`.
- [+] Реализована система иконок: единый источник UI-иконок в `src/shared/assets/icons`, автоиндекс `icons:sync`, проверка `icons:check`.
- [+] Добавлен агрегирующий `npm run check` для полного прогона проверок проекта.
- [+] Собран лендинг через `widgets -> pages/landing`, подключен в роутер, добавлены stories страницы (`Guest`/`Authorized`).
- [+] Добавлены layout-виджеты: `AppHeader`, `AppFooter`, `PageLayout`, а также session-state (`entities/session`) для гостя/авторизованного.
- [+] Весь текущий новый лендинг переведён на русский язык.
- [+] Доработан `AppHeader`: логотип, поиск, состояния гостя/авторизованного, профильная кнопка иконка+имя.
- [+] Обновлена кнопка (`primary/secondary/tertiary`, icon params left/right/iconOnly, variant-specific disabled, hover transitions).
- [+] Добавлен `h0` для hero (с последующей корректировкой веса), `Container full-width`, вынесен `Tag`-компонент с размерностью.
- [+] Перенесён hero-ассет из legacy в новый фронт и интегрирован в hero-секцию.
- [+] Настроен динамический `head`: title/description/favicon через router handle (например, `Статьи | Fungi`), для лендинга — `Fungi`.
- [+] Удалён неиспользуемый `storybook-template-legacy`.

### Backend

- [+] Зафиксированы и задокументированы правила валидации (`Username >= 8`, password policy), согласованы с фронтендом.
- [+] Приведено к более единообразному формату поведение ошибок API для корректного отображения на фронте.
