# Frontend

## Клиентские части

В репозитории есть rewrite-клиент и legacy-архив:

- `frontend/` — единственный активный веб-клиент (runtime + CI);
- `frontend_fungi/` — legacy-архив (в репозитории для истории, без runtime/compose/CI).

## Rewrite (`frontend`)

Ключевые принципы:

- FSD-структура для разделения ответственности;
- Storybook как база для UI-компонентов;
- дизайн-токены и quality-gates для консистентности;
- явная интеграция с backend через `VITE_API_URL`.

### Актуальные маршруты rewrite-клиента

- `/` — лендинг;
- `/about` — отдельная пользовательская страница «О нас»;
- `/search` — глобальный поиск по статьям и грибам;
- `/articles` — публичный каталог статей;
- `/articles/:id` — детальная карточка статьи;
- `/mushrooms` — публичный каталог грибов;
- `/mushrooms/:id` — детальная карточка гриба;
- `/login` — вход;
- `/register` — регистрация;
- `/profile` — профиль пользователя;
- `/profile?tab=<key>` — вкладки профиля (query-based);
- `/profile/favorites` и `/profile/history` — backward-compatible редиректы на query tabs.
- `/editor/articles` — workspace редактора (`scope=drafts|materials`);
- `/editor/articles/new` — создание статьи;
- `/editor/articles/:id/edit` — редактирование статьи;
- `/editor/review` — очередь модерации.
- `/editor/mushrooms` — workspace редактора грибов (`scope=drafts|materials`);
- `/editor/mushrooms/new` — создание новой ревизии гриба;
- `/editor/mushrooms/:revisionId/edit` — редактирование ревизии гриба;
- `/editor/mushrooms/review` — очередь модерации ревизий грибов.

### E2E smoke (Playwright)

- browser smoke-тесты rewrite-клиента находятся в `frontend/tests/e2e/workflows`;
- запуск локально:
  - `docker compose up -d --build fungi-db fungi-backend`;
  - `npm --prefix frontend run e2e:smoke`.
- покрытие smoke-набора:
  - `auth` (login/logout);
  - `catalog` (грибы -> детальная);
  - `profile`;
  - `likes`;
  - `editor workflows` (статьи и грибы).
- CI job `e2e-smoke` публикует артефакты Playwright при падениях (`playwright-report`, `test-results`).

### i18n статус

- текущее решение: **RU-only**;
- в этом этапе не внедряется i18n-библиотека и не добавляются EN-ресурсы;
- пересмотр решения — только по отдельному product-запросу (см. `docs/workflow/index.md`).

### Текущий auth UX

- после успешного `login` и `register` пользователь перенаправляется на `/profile`;
- после получения токена клиент запрашивает `/Users/GetCurrentUserProfile` и сохраняет данные пользователя в сессии;
- role-aware UI строится по permission-кодам из `user.role.permissions` (permission-based доступ);
- неавторизованный пользователь при заходе на `/profile*` перенаправляется на `/login`;
- editor-маршруты защищены permission-guard:
  - `/editor/articles*` требует `content.articles.write`;
  - `/editor/review` требует `content.articles.review`.
  - `/editor/mushrooms*` (list/new/edit) требует любой из:
    - `content.mushrooms.write`;
    - `content.mushrooms.manage-any`;
    - `content.mushrooms.review`;
    - `content.mushrooms.publish`;
    - `content.mushrooms.archive`.
  - `/editor/mushrooms/review` требует любой из:
    - `content.mushrooms.review`;
    - `content.mushrooms.publish`.
- базовые вкладки профиля для всех ролей:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`.
- role-specific вкладки и пункты dropdown показываются только при наличии нужных permission-кодов;
- быстрые переходы из профиля:
  - `editor-materials` -> `/editor/articles?scope=materials`;
  - `editor-drafts` -> `/editor/articles?scope=drafts`;
  - `ja-moderation` -> `/editor/review` (единый раздел модерации);
  - `mushroom-materials` -> `/editor/mushrooms?scope=materials`;
  - `mushroom-drafts` -> `/editor/mushrooms?scope=drafts`;
  - `mushroom-moderation` -> `/editor/mushrooms/review`;
  - остальные role-вкладки пока остаются как UI-заглушки.
- кнопка профиля в header открывает dropdown-меню:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`;
  - role-specific разделы для текущей роли;
  - `Выйти` (action-пункт, отделен разделителем).
- в `Profile Hero` реализован avatar-flow:
  - загрузка через file picker и drag&drop;
  - прогресс загрузки в процентах;
  - optimistic preview с откатом при ошибке;
  - удаление аватара;
  - fallback на инициалы при пустом/битом URL.
- в кнопке профиля header используется мини-аватар пользователя, при ошибке загрузки применяется fallback-глиф.
- dropdown закрывается по:
  - клику вне меню;
  - клавише `Esc`;
  - смене маршрута.
- при `401` в профильных API вызовах выполняется `signOut` и редирект на `/login`.
- checkbox `Запомнить меня` в логине управляет персистом bearer-токена:
  - включён: токен сохраняется в `localStorage` и сессия восстанавливается после перезагрузки;
  - выключен: токен хранится только в памяти текущего runtime.
- для восстановления сохранённой сессии на старте вызывается `GET /Users/GetCurrentUserProfile`;
- при невалидном токене выполняется авто-`signOut` и очистка `localStorage`.
- добавлена отдельная страница «О нас» (`/about`) с пользовательским контентом:
  - зачем существует проект;
  - ключевые возможности;
  - понятный блок «Как мы работаем для вас»;
  - контакты и финальный CTA.
- в секции контактов/CTA на странице «О нас» усилен контраст текста и кнопок для лучшей читаемости.

### Глобальные toast-ошибки

- page-level ошибки в rewrite-клиенте выводятся через единый toast-слой (`ToastProvider` + `useToast`);
- позиционирование:
  - desktop: снизу справа;
  - mobile (`max-width: 840px`): снизу по центру.
- поведение:
  - стек максимум `3` уведомления;
  - автоскрытие по умолчанию `4` секунды;
  - одинаковые ошибки схлопываются в окне `3` секунд;
  - на hover/focus таймер конкретного toast ставится на паузу.
- экраны с загрузкой данных сохраняют нейтральные fallback-блоки с кнопкой `Повторить`, но основной канал ошибок теперь toast.

### Каталог грибов и детальная карточка (frontend-first MVP)

- каталог (`/mushrooms`) работает как отдельная страница с URL-sync состояния;
- query-параметры каталога:
  - `q` — строка поиска;
  - `family` — семейство;
  - `eatable` — `all | edible | inedible`;
  - `redBook` — `1` (включен фильтр), отсутствие параметра = `false`;
  - `sort` — `name | likes`;
  - `page` — номер страницы.
- layout каталога:
  - левый sticky-сайдбар фильтров;
  - правый блок результатов с сортировкой, сеткой карточек и пагинацией.
- поиск по названию применяется автоматически с debounce `400ms`;
- пагинация серверная, размер страницы `12`;
- сортировка серверная (`sort=name|likes`).
- карточка списка ведет на `/mushrooms/:id`, обратный переход в каталог сохраняет query из `location.state.backTo`.
- вся карточка гриба кликабельна (переход в деталку), отдельная кнопка `Подробнее` не используется;
- лайк-кнопка в карточке:
  - иконка `favorite-icon` + счетчик;
  - визуально различимые состояния `liked/unliked` по цвету, фону и рамке.
- детальная карточка (`/mushrooms/:id`) отображает:
  - hero-блок (название, латинское имя, семейство, теги);
  - полное описание;
  - морфологию;
  - галерею (`headerPhotoLink + extraPhotoLinks`);
  - список двойников.
- лайки в списке и на деталке:
  - авторизованный пользователь: optimistic toggle + rollback при ошибке;
  - гость: popup с CTA `Регистрироваться` / `Позже`;
  - при `401`: `signOut` и редирект на `/login` с причиной `session-expired`.
- счётчики лайков приходят в DTO каталога (`likesCount`) и не требуют `N+1` запросов.

### Каталог статей и editor workspace

- публичный каталог `/articles`:
  - фильтры `q`, `author`, сортировка `newest|oldest|likes`, серверная пагинация (`page/pageSize`, `pageSize=12`);
  - карточка статьи кликабельна и ведет на `/articles/:id`;
  - лайк в карточке: optimistic toggle + rollback, guest popup при неавторизованном сценарии.
- детальная статья `/articles/:id`:
  - hero с метаданными и статусом;
  - рендер параграфов (`subtitle/body`);
  - галерея изображений;
  - список связанных грибов (`ArticleMushrooms/GetAllMushrooms`);
  - лайк-блок с тем же auth-flow, что в каталоге.
- editor workspace `/editor/articles`:
  - scope `Черновики` и `Мои материалы`;
  - быстрые действия: редактировать, отправить на модерацию, архивировать.
- editor форма `/editor/articles/new` и `/editor/articles/:id/edit`:
  - поля статьи, параграфы, связанные грибы;
  - upload изображений через backend (`/Articles/UploadArticleImage`) с прогрессом;
  - действия: `Сохранить черновик`, `Отправить на модерацию`, `Архивировать`.
- модерация `/editor/review`:
  - очередь `InReview`;
  - решения `Одобрить` / `Отклонить` с optional `reviewNote`.
  - в API отправляется строковый `decision`: `"Approve"` / `"Reject"` (int-формат не используется).

### Редактор грибов и модерация ревизий

- editor workspace `/editor/mushrooms`:
  - scope `Черновики` и `Материалы`;
  - карточки ревизий со статусами и быстрыми действиями.
- editor форма `/editor/mushrooms/new` и `/editor/mushrooms/:revisionId/edit`:
  - поля морфологии, описание, фото, двойники;
  - upload/delete изображений через backend (`/Mushrooms/UploadMushroomImage`) с прогрессом;
  - действия: `Сохранить черновик`, `Отправить на модерацию`, `Архивировать`.
- правило валидации:
  - для сохранения draft `headerPhotoLink` не обязателен;
  - для `SubmitForReview` обложка обязательна.
- модерация `/editor/mushrooms/review`:
  - `Reject` доступен с `content.mushrooms.review`;
  - `Approve` доступен с `content.mushrooms.publish`;
  - после approve доступен переход на опубликованную карточку `/mushrooms/:id` при наличии `publishedMushroomId`.
  - в API отправляется строковый `decision`: `"Approve"` / `"Reject"`.

### Storybook: runbook и правила

- Storybook guide: [docs/frontend/storybook.md](storybook.md);
- coverage matrix: [docs/frontend/storybook-coverage.md](storybook-coverage.md);
- основной локальный запуск:
  - `cd frontend`;
  - `npm run storybook` (`http://localhost:6006`);
- проверки перед PR с UI-изменениями:
  - `npm run stories:check`;
  - `npm run stories:coverage:check`;
  - `npm run storybook:build`;
  - `npm run storybook:check`;
  - `npm run test:components`.
- для unit/component тестов primitives используется Vitest + Testing Library:
  - `Button`, `Input`, `Select`, `Checkbox`, `Typography`.
- глобальные decorators уже подключены в `.storybook/preview.ts`:
  - `MemoryRouter`;
  - `ToastProvider`.
- для stories с `react-query` и auth/session добавляем локальные обертки:
  - `QueryClientProvider`;
  - `SessionProvider`.
- реальные HTTP-запросы в stories запрещены: только mocks/fixtures и детерминированные state-сценарии.
- coverage matrix обновляем при:
  - добавлении/удалении/переименовании story;
  - изменении Storybook `title`;
  - изменении обязательных state-сценариев или ключевых page-level flow.
  - команда обновления: `npm run stories:coverage`.

### Storybook: покрытие ключевых сценариев

- грибной каталог и детальная:
  - `Pages/Mushrooms/MushroomsPage`;
  - `Pages/Mushrooms/MushroomDetailPage`;
  - `Features/Mushrooms/AuthRequiredPopup`.
- статьи и редакторский workflow:
  - `Pages/Articles/ArticlesPage`;
  - `Pages/Articles/ArticleDetailPage`;
  - `Pages/Editor/EditorArticlesPage`;
  - `Pages/Editor/EditorArticleFormPage`;
  - `Pages/Editor/EditorReviewPage`;
  - `Pages/Editor/EditorMushroomsPage`;
  - `Pages/Editor/EditorMushroomFormPage`;
  - `Pages/Editor/EditorMushroomReviewPage`;
  - `Features/Articles/AuthRequiredPopup`.
- общие state-компоненты:
  - `Shared/UI/ContentState`;
  - `Shared/UI/Composites/Toast`.

Минимум для page-level stories:

- `loading`;
- `empty`;
- `error`;
- базовый рабочий сценарий (`default`/`filled`);
- auth-ветки (гость vs авторизованный) для экранов, где это влияет на UX.

### Навигация в header

- `О нас` ведет на отдельную страницу `/about`;
- `Грибы` ведет на отдельную страницу `/mushrooms`;
- `Статьи` ведет на `/articles`;
- поиск из `AppHeader`:
  - непустой запрос -> `/search?q=<query>`;
  - пустой запрос -> `/search`.
- `Отзывы` ведет на якорь главной страницы `/#reviews`, чтобы не создавать URL вида `/profile#about`;
- переходы `Войти/Регистрация/Профиль` выполняются через client-side routing (без full page reload).

### Глобальный поиск (`/search`)

- `q` в query-параметрах — источник истины состояния поиска;
- страница делает два server-side запроса:
  - статьи (`GET /Articles/GetFilteredArticles`);
  - грибы (`GET /Mushrooms/GetFilteredMushrooms`);
- для обеих секций применяются фиксированные параметры:
  - `sort=likes`;
  - `page=1`;
  - `pageSize=6`.

### Общий компонент состояний (`ContentState`)

- единый UI-компонент для page-level состояний:
  - `loading`;
  - `empty`;
  - `error`;
  - `info`.
- контракт пропсов:
  - `title`;
  - `description?`;
  - `tone?`;
  - `action?`;
  - `className?`.
- используется в каталогах, деталках, профильных preview-блоках и editor-списках.

## Legacy (`frontend_fungi`)

- Папка сохранена только как historical artifact.
- В runtime/CI/Docker compose legacy-клиент не используется.
- Новые изменения в `frontend_fungi/` не вносятся.

## Интеграция с API

- Auth-контракт: bearer-токен в заголовке `Authorization`.
- Профильные endpoint-ы для rewrite-клиента:
  - `GET /Users/GetCurrentUserProfile`;
  - `POST /Users/UploadMyAvatar`;
  - `DELETE /Users/DeleteMyAvatar`.
- Endpoint-ы каталога грибов:
  - `GET /Mushrooms/GetFilteredMushrooms`;
  - `GET /Mushrooms/GetMushroom`.
- Endpoint-ы лайков грибов:
  - `GET /MushroomLikes/GetLikesCount/count`;
  - `GET /MushroomLikes/HasUserLiked/user` (только авторизованный);
  - `POST /MushroomLikes/ToggleLike` (только авторизованный).
- При изменении API-контракта обновлять docs в `docs/backend-api/*`.

## Минимальный чеклист для frontend PR

- сборка и линтер проходят;
- нет raw debug/log кода в финальном варианте;
- учтены loading/error/empty состояния;
- для UI-изменений пройдены Storybook-проверки (`stories:check`, `storybook:build`, `storybook:check`);
- если менялся API-контракт, обновлены docs и OpenAPI snapshot.
