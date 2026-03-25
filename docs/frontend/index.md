# Frontend

## Клиентские части

В репозитории есть два веб-клиента:

- `frontend/` — новый rewrite-клиент (основной вектор развития);
- `frontend_fungi/` — legacy-клиент, который еще используется частично.

## Rewrite (`frontend`)

Ключевые принципы:

- FSD-структура для разделения ответственности;
- Storybook как база для UI-компонентов;
- дизайн-токены и quality-gates для консистентности;
- явная интеграция с backend через `VITE_API_URL`.

### Актуальные маршруты rewrite-клиента

- `/` — лендинг;
- `/about` — отдельная пользовательская страница «О нас»;
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

### Текущий auth UX

- после успешного `login` и `register` пользователь перенаправляется на `/profile`;
- после получения токена клиент запрашивает `/Users/GetCurrentUserProfile` и сохраняет данные пользователя в сессии;
- role-aware UI строится по permission-кодам из `user.role.permissions` (permission-based доступ);
- неавторизованный пользователь при заходе на `/profile*` перенаправляется на `/login`;
- editor-маршруты защищены permission-guard:
  - `/editor/articles*` требует `content.articles.write`;
  - `/editor/review` требует `content.articles.review`.
- базовые вкладки профиля для всех ролей:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`.
- role-specific вкладки и пункты dropdown показываются только при наличии нужных permission-кодов;
- быстрые переходы из профиля:
  - `editor-materials` -> `/editor/articles?scope=materials`;
  - `editor-drafts` -> `/editor/articles?scope=drafts`;
  - `ja-moderation` -> `/editor/review` (единый раздел модерации);
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
  - `redBook` — `0 | 1`;
  - `sort` — `name | likes`;
  - `page` — номер страницы.
- layout каталога:
  - левый sticky-сайдбар фильтров;
  - правый блок результатов с сортировкой, сеткой карточек и пагинацией.
- поиск по названию применяется автоматически с debounce `400ms`;
- пагинация клиентская, размер страницы `12`;
- сортировки:
  - по названию (`localeCompare('ru')`);
  - по лайкам (descending, tie-breaker по имени).
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
- текущее ограничение MVP: лайки в каталоге реализованы через `N+1` запросы к count endpoint-у.

### Каталог статей и editor workspace

- публичный каталог `/articles`:
  - фильтры `q`, `author`, сортировка `newest|oldest|likes`, клиентская пагинация;
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

### Storybook покрытие (актуально)

Новые/обновленные истории для сценария каталога грибов:

- `Pages/Mushrooms/MushroomsPage`;
- `Pages/Mushrooms/MushroomDetailPage`;
- `Features/Mushrooms/AuthRequiredPopup`.

Покрытие для article/editor flow:

- `Pages/Articles/ArticlesPage`;
- `Pages/Articles/ArticleDetailPage`;
- `Pages/Editor/EditorArticlesPage`;
- `Pages/Editor/EditorArticleFormPage`;
- `Pages/Editor/EditorReviewPage`;
- `Features/Articles/AuthRequiredPopup`.

Минимальный набор состояний:

- гость и авторизованный пользователь;
- открытое/закрытое состояние popup;
- fallback-состояния картинок в карточках и деталке.

### Навигация в header

- `О нас` ведет на отдельную страницу `/about`;
- `Грибы` ведет на отдельную страницу `/mushrooms`;
- `Статьи` ведет на `/articles`;
- `Отзывы` ведет на якорь главной страницы `/#reviews`, чтобы не создавать URL вида `/profile#about`;
- переходы `Войти/Регистрация/Профиль` выполняются через client-side routing (без full page reload).

## Legacy (`frontend_fungi`)

- Поддерживается для текущих рабочих сценариев и миграции.
- Новые изменения желательно вносить в rewrite-часть, если нет блокеров.

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
- если менялся API-контракт, обновлены docs и OpenAPI snapshot.
