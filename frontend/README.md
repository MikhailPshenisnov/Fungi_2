# Fungi Frontend (Rewrite)

Новый фронтенд для постепенного переписывания `frontend_fungi`.

Цель: развивать приложение компонентно, без больших ломок, на предсказуемой архитектуре.

## Стек
- React + TypeScript + Vite
- React Router
- TanStack Query
- Storybook
- ESLint + Prettier
- Vitest + Testing Library

## Запуск
```bash
npm install
npm run dev
```

## Скрипты
- `npm run dev` — локальная разработка
- `npm run build` — production build
- `npm run preview` — предпросмотр сборки
- `npm run typecheck` — проверка типов
- `npm run lint` — линтинг
- `npm run check` — полный quality gate (`lint`, `typecheck`, `design:lint`, `stories:check`, `icons:check`, `test`, `build`)
- `npm run lint:styles` — stylelint для CSS (запрет raw-цветов вне tokens)
- `npm run lint:design` — semantic token checks для TS/TSX/CSS
- `npm run design:lint` — полный gate дизайн-семантики (`lint:styles` + `lint:design`)
- `npm run icons:sync` — пересборка `src/shared/assets/icons/index.ts` по SVG в `src/shared/assets/icons`
- `npm run icons:check` — проверка правил по иконкам (дубли, запрет UI-иконок в `public/images/icons`, актуальность `index.ts`)
- `npm run scaffold:ui -- <ComponentName>` — генерация `shared/ui/primitives` компонента + draft story
- `npm run scaffold:ui -- <ComponentName> --category=composites` — генерация `shared/ui/composites` компонента + draft story
- `npm run remove:ui -- <ComponentName> --yes` — удаление `shared/ui` компонента (поиск в `primitives/composites`) + автоочистка экспортов
- `npm run ui:index:sync` — пересборка `src/shared/ui/index.ts` по текущим компонентам
- `npm run stories:check` — проверка, что у всех `shared/ui` компонентов есть `.stories.tsx`
- `npm run stories:sync` — автосоздание отсутствующих draft stories (`Draft/*`, `tags: ['wip']`)
- `npm run test` — unit тесты
- `npm run storybook` — Storybook dev server
- `npm run storybook:build` — сборка Storybook
- `npm run storybook:test` — запуск story-тестов (a11y/smoke) для поднятого Storybook
- `npm run storybook:check` — автоподнятие Storybook + прогон story-тестов

## Архитектура (FSD + UI-kit)

```txt
src/
  app/
    entrypoint/
    providers/
    router/
    styles/
  processes/
  pages/
  widgets/
  features/
  entities/
  shared/
    api/
    assets/
    config/
    constants/
    hooks/
    lib/
    testing/
    types/
    ui/
```

### Смысл слоев
- `app` — инициализация приложения, роутер, провайдеры, глобальные стили.
- `pages` — маршруты и композиция виджетов.
- `widgets` — крупные UI-блоки страниц.
- `features` — пользовательские сценарии (действия).
- `entities` — бизнес-сущности и их UI/model/api.
- `shared` — общие примитивы и инфраструктура.

### Правило зависимостей
Импорт только вниз по слоям:
- `pages -> widgets/features/entities/shared`
- `widgets -> features/entities/shared`
- `features -> entities/shared`
- `entities -> shared`

Запрещено импортировать вверх.

## Head (title/description/favicon)
- `title` страницы управляется через `handle` в роутере (`src/app/router/index.tsx`).
- Формат заголовка: `<Название страницы> | Fungi` (например: `Статьи | Fungi`).
- Если `title` не задан, используется `Fungi`.
- Favicon по умолчанию: `/images/branding/fungi-logo.svg`.

Пример маршрута:
```tsx
{
  path: '/articles',
  element: <ArticlesPage />,
  handle: {
    title: 'Статьи',
    description: 'Публикации и материалы о грибах'
  }
}
```

## Текущие пользовательские маршруты (rewrite)

- `/` — лендинг;
- `/about` — отдельная страница «О нас»;
- `/mushrooms` — каталог грибов;
- `/mushrooms/:id` — детальная карточка гриба;
- `/login` — вход;
- `/register` — регистрация;
- `/profile` — профиль пользователя;
- `/profile?tab=<key>` — секции профиля (базовые и role-specific);
- `/profile/favorites` и `/profile/history` — legacy-алиасы с редиректом в query-tab формат.

### Страница «О нас» (`/about`)

- реализована как отдельная публичная страница, а не якорь внутри лендинга;
- содержит пользовательские блоки: миссия проекта, возможности, принципы работы, контакты и CTA;
- блок «Команда» подан в user-friendly формате («Как мы работаем для вас»), без внутренней технической терминологии;
- для контактного и финального CTA-блоков усилен визуальный контраст текста и кнопок.

### Каталог грибов (`/mushrooms`) и детальная карточка (`/mushrooms/:id`)

- каталог вынесен в отдельную публичную страницу с layout `сайдбар фильтров + сетка карточек`;
- состояние каталога синхронизируется с URL:
  - `q` — поиск по названию;
  - `family` — фильтр по семейству;
  - `eatable` — `all | edible | inedible`;
  - `redBook` — `0 | 1`;
  - `sort` — `name | likes`;
  - `page` — номер страницы.
- поиск применяется автоматически с debounce `400ms`;
- сортировка:
  - `По названию`;
  - `По лайкам`;
- пагинация клиентская, по `12` карточек на страницу;
- карточка гриба ведет на `/mushrooms/:id`;
- вся карточка кликабельна, отдельная кнопка `Подробнее` удалена;
- лайки доступны в каталоге и на деталке:
  - авторизованный пользователь: optimistic update + rollback при ошибке;
  - гость: pop-up с CTA `Регистрироваться` и `Позже`;
  - при `401`: `signOut` и редирект на `/login`.
- лайк в карточке каталога отображается как иконка `favorite-icon` + счетчик;
- для `liked/unliked` применяются разные визуальные состояния (цвет, рамка, фон).
- детальная карточка показывает:
  - базовые поля и описание;
  - морфологию;
  - галерею (`headerPhotoLink + extraPhotoLinks`);
  - список двойников.

## Auth и профиль (текущее поведение)

- после успешного входа/регистрации выполняется редирект на `/profile`;
- после получения bearer-токена клиент запрашивает `/Users/GetCurrentUserProfile` и сохраняет актуальный профиль в сессии;
- доступ к role-specific UI строится по permission-кодам из `user.role.permissions`, без клиентского хардкода групп;
- защита profile-маршрутов: при отсутствии сессии редирект на `/login`;
- в профиле всегда доступны базовые вкладки:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`.
- role-specific вкладки отображаются только при наличии соответствующих permission-кодов.
- в header для авторизованного пользователя доступен dropdown:
  - `Профиль`;
  - `Избранное`;
  - `История просмотров`;
  - role-specific пункты для текущей роли;
  - `Выйти`.
- в `Profile Hero` доступно управление аватаром:
  - загрузка через file picker и drag&drop;
  - реальный прогресс загрузки (%);
  - optimistic preview с откатом при ошибке;
  - удаление аватара;
  - fallback на инициалы при пустом/битом URL.
- в кнопке профиля header показывается мини-аватар, при ошибке загрузки используется fallback-иконка.
- при `401` в профильных API вызовах выполняется `signOut` и редирект на `/login` с сообщением о завершённой сессии.
- checkbox `Запомнить меня` в логине управляет персистом сессии:
  - включён: bearer-токен сохраняется в `localStorage`, сессия восстанавливается после `F5`;
  - выключен: токен хранится только в runtime-памяти и очищается при перезагрузке страницы.
- для восстановления сохранённой сессии на старте приложения выполняется `GET /Users/GetCurrentUserProfile`;
- при невалидном токене происходит авто-`signOut` и очистка `localStorage`.

## Правила модулей
Каждый `feature/entity/widget/page` держим в формате:

```txt
module-name/
  api/
  model/
  ui/
  lib/
  index.ts
```

Наружу экспортируем только через `index.ts`.

## Storybook: правила использования

Основная идея: Storybook — это контракт UI-kit и feature-компонентов.

1. Что обязательно покрываем story:
- каждый компонент из `src/shared/ui`;
- каждый визуально сложный компонент из `features/*/ui`;
- ключевые состояния: `default`, `loading`, `error`, `empty`, `disabled` (где применимо).

2. Где храним stories:
- рядом с компонентом: `Component.stories.tsx`.

3. Что запрещено в story:
- реальные сетевые запросы;
- зависимость от внешнего backend;
- состояние, которое нельзя воспроизвести через args/mocks.

4. Что должно быть в каждой story:
- понятный `title` по слоям (`Shared/UI/Button`, `Features/Auth/LoginForm`);
- `args` по умолчанию;
- минимум одна интерактивная вариация, если компонент интерактивный.

5. Review policy:
- изменения в `shared/ui` без обновления stories не принимаются;
- визуальные изменения в компонентах сопровождаются скриншотами из Storybook.

6. Draft stories policy:
- автогенерация создаёт stories в `Draft/Shared/UI/*` с `tags: ['wip']`;
- такие stories считаются временными и должны быть переведены в `Shared/UI/*` после review;
- перед релизной итерацией запускаем `npm run stories:check`.

7. Управление жизненным циклом компонента:
- создание через `npm run scaffold:ui -- <ComponentName>` (по умолчанию `primitives`);
- для composition-компонентов используем `--category=composites`;
- удаление через `npm run remove:ui -- <ComponentName> --yes` (при конфликте имён указываем `--category=...`);
- `src/shared/ui/index.ts`, `src/shared/ui/primitives/index.ts`, `src/shared/ui/composites/index.ts` не редактируем вручную, они синхронизируются скриптом.

Детали: `docs/STORYBOOK.md`.

### Storybook: покрытие по каталогу грибов

- `Pages/Mushrooms/MushroomsPage`
- `Pages/Mushrooms/MushroomDetailPage`
- `Features/Mushrooms/AuthRequiredPopup`

## Assets: Icons & Images
- Переиспользуемые UI-иконки храним в `src/shared/assets/icons`.
- Маркетинговые/контентные изображения и файлы по URL храним в `public/images`.
- Рекомендуемые подпапки:
  - `public/images/branding` — логотипы и бренд-графика.

Ограничения:
- Единственный источник UI-иконок: только `src/shared/assets/icons`.
- В `public` UI-иконки не храним.
- Импорт UI-иконок делаем только через `src/shared/assets/icons/index.ts`.

Процесс работы с иконками:
1. Добавь `*.svg` в `src/shared/assets/icons`.
2. Запусти `npm run icons:sync` (обновит `index.ts`).
3. Импортируй только из `@shared/assets/icons`.

Пример импорта:
```ts
import { mailIcon, profileIcon } from '@shared/assets/icons';
```

## Пошаговый rewrite-процесс
1. Сначала переносим базовые примитивы в `shared/ui`.
2. Затем переносим фичи (auth, filter, search) в `features`.
3. После этого собираем `widgets` и `pages`.
4. В конце вычищаем legacy и дубли.

## Definition of Done
Задача готова, если:
- соблюдены слои и публичные API модулей;
- нет `any` без обоснования;
- `typecheck`, `lint`, `design:lint`, `build` зелёные;
- для UI-изменений обновлены stories.

## ADR (Architecture Decision Records)
ADR используется для фиксации архитектурных решений, чтобы команда понимала причину и последствия выбора.

- Храним ADR в `docs/adr`.
- Шаблон: `docs/adr/0000-template.md`.
- Именование: `NNNN-kebab-case-title.md` (например, `0001-shared-ui-primitives-composites.md`).
- Статусы: `Proposed` -> `Accepted` -> `Superseded` (если решение заменено новым ADR).

Когда ADR обязателен:
- изменение слоёв/границ модулей (`shared/entities/features/widgets/pages`);
- изменение контракта design system (tokens, naming, rules, quality gates);
- внедрение или изменение ключевых инженерных процессов (scaffold/remove/sync/check scripts, CI quality gates).

## Design Token Quality Gate
Для всех UI-изменений обязательна проверка:
```bash
npm run design:lint
```

Что проверяется:
1. В компонентных CSS запрещены прямые цвета (`#...`, `rgb/rgba`, `hsl/hsla`).
2. Вне `src/shared/assets/styles/tokens.css` запрещено использовать primitive-токены `--ref-*`.
3. Запрещены legacy-алиасы вида `var(--color-text)`, `var(--color-bg)` и т.д.

Цель: компоненты должны использовать только semantic токены контракта (`--color-*`, `--text-*`, `--radius-*`, ...).
