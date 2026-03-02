# Foundation System

Документ фиксирует baseline-дизайн и план foundation-слоя для нового фронтенда.
После утверждения используется как источник правды для токенов и UI-kit.

## 1. Design Tokens (v1)

### 1.1 Цвета

- `primary`: `#FFE8C4`
- `accent`: `#FFE8C4` (accent не выделяем отдельно, используем primary)
- `bg`: `#FFFFFF`
- `surface`: `#F5F5F5`
- `text`: `#3B2F2F`
- `muted`: `#F0E5D3`
- `border`: `#FFE8C4`
- `success`: `#6CBB62`
- `warning`: `#DB8F45`
- `error`: `#D44343`
- `info`: `#7AB3AD`

### 1.2 Типографика

- `font-heading`: `Raleway`
- `font-body`: `Inter`
- `font-mono`: `JetBrains Mono`

#### Заголовки

- `H1`: `40px / 1.2`
- `H2`: `32px / 1.25`
- `H3`: `24px / 1.3`
- `H4`: `20px / 1.35`
- `H5`: `18px / 1.35`

#### Текст

- `Body L`: `18px`
- `Body`: `16px`
- `Body S`: `14px`
- `Caption`: `13px`
- `Small / Meta`: `12px`

### 1.3 Форма и глубина

- Style: `editorial / natural / minimal`
- Tone: `calm / scientific / warm`
- Радиусы:
  - `radius-s`: `6px`
  - `radius-m`: `10px`
  - `radius-l`: `14px`
- Тени:
  - `shadow-base`: `0 1px 2px rgba(60,47,47,0.06)`
- `shadow-hover`: `0 4px 12px rgba(60,47,47,0.08)`
- Основной способ разделения блоков: `border` (а не тяжелые тени)

### 1.4 Нейминг токенов (контракт)

#### Primitive tokens (raw palette)
- Формат: `--ref-color-<hue>-<step>`
- Примеры:
  - `--ref-color-amber-100`
  - `--ref-color-brown-900`
- Правило: primitives не используются напрямую в компонентах.

#### Semantic tokens
- Формат: `--color-<role>-<slot>[-<state>]`
- state всегда последним сегментом.

##### Роль `bg/surface`
- Слоты:
  - `default`
  - `subtle`
  - `muted`
  - `elevated`
  - `inverse`

##### Роль `text`
- Слоты:
  - `primary`
  - `secondary`
  - `tertiary`
  - `disabled`
  - `inverse`
  - `on-brand`

##### Роль `border`
- Слоты:
  - `default`
  - `subtle`
  - `strong`
  - `focus`

#### Actions (интерактив)
- Формат: `--color-action-<variant>-<part>[-<state>]`
- Примеры:
  - `--color-action-primary-bg`
  - `--color-action-primary-on-bg`
  - `--color-action-primary-bg-hover`
  - `--color-action-primary-focus-ring`
- Для читаемости и контраста обязательно используем пару `bg + on-bg`.

#### Status
- Формат: `--color-status-<type>-<part>`
- Примеры:
  - `--color-status-success-bg`
  - `--color-status-success-on-bg`
  - `--color-status-success-border`
  - `--color-status-success-strong`
- Для статусов также обязательно используем `on-bg`.

#### Overlay
- Разделяем:
  - `--color-overlay-scrim` (затемнение под модалками)
  - `--color-overlay-backdrop` (подложка/эффект фона)

#### Theme contract
- Семантика — стабильный контракт (`--color-*` имена не меняем).
- Значения меняются через тему (`[data-theme='light']`, `[data-theme='...']`).
- Это позволяет менять бренд/тему без правок компонентов.

### 1.5 Автопроверка семантики (enforcement)

Для предотвращения отклонений от foundation-контракта введён обязательный gate:

```bash
npm run design:lint
```

Проверка включает:
1. `lint:styles`:
   - в CSS-компонентах запрещены raw-цвета (`#...`, `rgb/rgba`, `hsl/hsla`);
   - допускается только семантическое использование токенов.
2. `lint:design`:
   - `--ref-*` разрешены только в `src/shared/assets/styles/tokens.css`;
   - `--color-*` в `tokens.css` не должны содержать raw-цвета (`#...`, `rgb/rgba`, `hsl/hsla`) и должны ссылаться на `--ref-*`/computed-from-ref;
   - legacy-токены (`var(--color-text)`, `var(--color-bg)` и т.д.) запрещены.

## 2. Адаптив

- `mobile-min`: `360`
- breakpoints:
  - `sm`: `480`
  - `md`: `768`
  - `lg`: `1024`
  - `xl`: `1280`
  - `2xl`: `1440`

## 3. Доступность

- Цель контрастов: `WCAG AA`
- Поддержка `prefers-reduced-motion: reduce`: обязательна

## 4. Компоненты первой волны (Foundation Wave 1)

Блокирующий минимум для старта фич и страниц:

1. `Typography`
2. `Button`
3. `Input`
4. `Select`
5. `Checkbox`
6. `Card`
7. `Container`
8. `Stack`

### 4.1 Обязательные состояния для Storybook (Wave 1)

- `default`
- `disabled`
- `hover/focus` (через docs/playground)
- `error` (для форм-контролов)
- `with-helper-text` (для форм-контролов)

## 5. Компоненты второй волны (Foundation Wave 2)

Расширение для прикладных модулей и унификации UX:

1. `Textarea`
2. `Radio` + `RadioGroup`
3. `Switch`
4. `FormField` (label + control + hint + error)
5. `Badge`
6. `Tag/Chip`
7. `Alert` (success/warning/error/info)
8. `Tooltip`
9. `Divider`
10. `Skeleton`
11. `Spinner`
12. `EmptyState`
13. `Pagination`
14. `Tabs`
15. `Modal (base)`
16. `Drawer (base)`

### 5.1 Приоритет Wave 2

- P1 (ранний): `FormField`, `Alert`, `Badge`, `Skeleton`, `Spinner`, `EmptyState`
- P2 (после первых страниц): `Tabs`, `Modal`, `Drawer`, `Pagination`, `Tooltip`, `Tag/Chip`

## 6. План внедрения

1. Зафиксировать токены в `src/app/styles` и `src/shared/assets/styles`.
2. Реализовать Wave 1 компоненты в `src/shared/ui`.
3. Сделать stories для каждого компонента Wave 1.
4. Использовать только Wave 1 компоненты в первом переносимом feature (auth).
5. После auth переходить к Wave 2 (P1, потом P2).

## 7. Критерии утверждения

Считаем foundation утвержденным, если:

- токены совпадают с разделом 1;
- все компоненты Wave 1 имеют stories;
- проверены `lint`, `typecheck`, `build`, `storybook:build`;
- контраст и focus states соответствуют AA для базовых сценариев.

---

Version: v1
Status: На утверждение
