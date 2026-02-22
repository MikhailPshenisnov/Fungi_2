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
- `npm run test` — unit тесты
- `npm run storybook` — Storybook dev server
- `npm run storybook:build` — сборка Storybook

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

Детали: `docs/STORYBOOK.md`.

## Пошаговый rewrite-процесс
1. Сначала переносим базовые примитивы в `shared/ui`.
2. Затем переносим фичи (auth, filter, search) в `features`.
3. После этого собираем `widgets` и `pages`.
4. В конце вычищаем legacy и дубли.

## Definition of Done
Задача готова, если:
- соблюдены слои и публичные API модулей;
- нет `any` без обоснования;
- `typecheck`, `lint`, `build` зелёные;
- для UI-изменений обновлены stories.
