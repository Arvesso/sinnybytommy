# TOMMYSINNY®

Дипломный проект — полнофункциональный e-commerce авторского fashion-бренда
с админ-панелью, аутентификацией и системой заказов.

---

## Содержание

1. [Описание проекта](#описание-проекта)
2. [Технологический стек](#технологический-стек)
3. [Архитектура](#архитектура)
4. [Установка и запуск](#установка-и-запуск)
5. [Доступы](#доступы)
6. [Структура проекта](#структура-проекта)
7. [Функционал](#функционал)
8. [Схема базы данных](#схема-базы-данных)
9. [API-справочник](#api-справочник)
10. [Замена изображений](#замена-изображений)
11. [Команды](#команды)
12. [Деплой на сервер](#деплой-на-сервер)
13. [Возможные проблемы](#возможные-проблемы)

---

## Описание проекта

**TOMMYSINNY** — это не просто одежда. Это социальный эксперимент и сатира на
современную культуру потребления, гламур и стритвир-индустрию. Бренд строится на
парадоксе: сознательное использование «кричащего» провинциального гламура и
мем-эстетики нулевых, возведённых в абсолют и упакованных в дорогой,
качественный продукт.

Веб-приложение реализует полный цикл интернет-магазина:

- Публичная витрина с каталогом, корзиной, оформлением заказа и оплатой
- Личный кабинет покупателя с историей заказов
- Административная панель для управления каталогом, заказами и контентом
- Адаптивная вёрстка под десктоп, планшет и мобильные устройства
- Система валидации и масок для всех форм ввода

---

## Технологический стек

### Frontend

| Технология | Назначение |
|---|---|
| **React 18** | UI-фреймворк |
| **Vite 5** | Сборщик и dev-сервер с HMR |
| **React Router 6** | SPA-роутинг |
| **Zustand** | State-менеджмент (auth, cart) с `persist` для корзины |
| **Framer Motion** | Анимации hero-слайдера, переходов, hover-эффектов |
| **Custom CSS** | Без UI-библиотек: вся вёрстка — авторская |

### Backend

| Технология | Назначение |
|---|---|
| **Node.js 20+** | Runtime |
| **Express 4** | HTTP-сервер и роутинг API |
| **better-sqlite3** | Синхронный SQLite-драйвер (быстрый, без callback hell) |
| **jsonwebtoken** | JWT-токены в HttpOnly cookie |
| **multer** | Загрузка файлов (изображения товаров) |
| **cookie-parser** | Парсинг cookie |

### Без чего удалось обойтись

- TypeScript — проект остаётся в чистом JS для скорости разработки
- Сторонние UI-киты (Material, Chakra, Tailwind) — вёрстка авторская
- Redis / Postgres — SQLite избыточно для масштабов задачи
- Docker — `npm install` + `npm start` достаточно
- Webpack / Babel — Vite справляется

---

## Архитектура

### Монолитное приложение

Frontend и backend живут в одном репозитории и одном `package.json`. В режиме
разработки запускаются параллельно через `concurrently`, в продакшене Express
отдаёт статику собранного клиента.

```
┌─────────────────────────────────────────────────┐
│                  npm run start                   │
├─────────────────────────────────────────────────┤
│                                                  │
│   Express :4000                                  │
│   ├── /api/auth/*    ──► routes/auth.js         │
│   ├── /api/products  ──► routes/catalog.js      │
│   ├── /api/orders    ──► routes/orders.js       │
│   ├── /api/admin/*   ──► routes/admin.js        │
│   ├── /uploads/*     ──► статика data/uploads/  │
│   └── /*             ──► статика dist/          │
│                                                  │
│   ▼                                              │
│   better-sqlite3                                │
│   └── data/db.sqlite                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

В режиме разработки:

```
Vite :5173 ─── proxy /api ──► Express :4000
              proxy /uploads
```

### Аутентификация

Реализована **упрощённая phone-auth** (имитация SMS-кода для дипломной защиты):

1. `POST /api/auth/start { phone }` — нормализует номер, создаёт пользователя
   если его нет, выставляет JWT-cookie
2. Если профиль не заполнен (`needsProfile: true`) — редирект на `/register`
3. `POST /api/auth/complete { first_name, last_name }` — добивает имя/фамилию
4. JWT-cookie живёт 30 дней, флаг `HttpOnly` + `SameSite: Lax`

В реальном проекте перед `auth/start` стоял бы шаг с отправкой SMS-кода.

### Корзина

Локальная: хранится в `localStorage` через `zustand/persist`. Не требует
авторизации, синхронизация с сервером происходит только в момент создания
заказа — сервер пересчитывает сумму по `product_id` чтобы исключить подмену
цены на клиенте.

---

## Установка и запуск

### Требования

- Node.js 20 или новее (тестировалось на 24.15)
- npm 10+

### Установка

```bash
git clone <repo>
cd sinnybytommy
npm install
```

### Режим разработки

```bash
npm run dev
```

Запустит:
- **Vite dev-сервер** на `http://localhost:5173` (HMR, прокси на `/api`)
- **Express API** на `http://localhost:4000` (с `node --watch`, авто-перезапуск)

Открывать `http://localhost:5173`.

### Продакшен-сборка

```bash
npm run build      # компилирует client/ в dist/
npm start          # стартует Express, отдаёт dist/ как статику
```

Открывать `http://localhost:4000`.

### Первый запуск

При первом старте сервера:

1. Создаётся файл `data/db.sqlite` со всеми таблицами
2. Запускается `seed()` — наполняет БД 35 тестовыми товарами в 5 категориях,
   3 hero-слайдами, 2 лукбук-карточками, 5 «селебрити», создаёт админ-аккаунт
3. Готовая база сохраняется до `npm run seed -- --force` или удаления `data/db.sqlite`

---

## Доступы

### Админ-аккаунт (по умолчанию)

| Поле | Значение |
|---|---|
| Телефон | `+7 (900) 000-00-00` |
| Имя | `Admin` |
| Фамилия | `TommySinny` |
| Роль | `is_admin: 1` |

Войти через `/login` → ввести номер → попадёте в личный кабинет, где появится
ссылка «Админ-панель». Прямой URL: `/admin`.

### Создать ещё одного админа

Через UI: `/admin/users` → найти пользователя → «Сделать админом».

Через консоль:

```bash
sqlite3 data/db.sqlite "UPDATE users SET is_admin = 1 WHERE phone = '+71234567890';"
```

### Тестовая карта для оплаты

Маска номера карты + Luhn-проверка работают честно. Для прохождения формы:

- **Номер карты:** `4242 4242 4242 4242` (Visa)
- **Срок:** любая дата в будущем (`12/30`)
- **CVC:** `123`
- **Имя:** `IVAN IVANOV` (минимум имя + фамилия латиницей)

---

## Структура проекта

```
sinnybytommy/
├── package.json              # один package.json на весь проект
├── vite.config.js            # Vite конфиг (root: client, proxy /api → :4000)
├── README.md                 # этот файл
│
├── server/                   # Backend (Express + SQLite)
│   ├── index.js              # точка входа, monkey-patches, статика
│   ├── db.js                 # схема БД, миграции на старте
│   ├── seed.js               # начальное наполнение тестовыми данными
│   ├── auth.js               # JWT-helpers, middleware (authMiddleware,
│   │                         # requireUser, requireAdmin)
│   └── routes/
│       ├── auth.js           # /api/auth/* — phone-auth, /me, /logout
│       ├── catalog.js        # /api/products, /categories, /home
│       ├── orders.js         # /api/orders — создание, история, детали
│       └── admin.js          # /api/admin/* — CRUD, stats, upload
│
├── client/                   # Frontend (React + Vite)
│   ├── index.html
│   ├── public/
│   │   ├── logo.svg          # дракон, головой вправо (для левой части лого)
│   │   └── logo-2.svg        # дракон зеркальный (для правой части)
│   └── src/
│       ├── main.jsx          # ReactDOM render + BrowserRouter
│       ├── App.jsx           # роуты, Header/Footer, защищённые роуты
│       ├── api.js            # fetch-обёртка, formatPrice
│       ├── store.js          # zustand: useAuth, useCart, useUI
│       ├── styles/
│       │   └── global.css    # CSS-переменные, базовые стили,
│       │                     # анимации reveal/page-transition
│       ├── utils/
│       │   └── forms.js      # маски и валидаторы (phone, card, exp, cvc, ...)
│       ├── components/
│       │   ├── Header.jsx    # шапка с боковым меню и поиском
│       │   ├── Footer.jsx    # футер с тикером и навигацией
│       │   ├── Logo.jsx      # лого: [дракон]TOMMYSINNY[дракон зеркальный]
│       │   └── ProductCard.jsx
│       ├── pages/
│       │   ├── Home.jsx      # hero, popular, lookbook, about, celebs
│       │   ├── Catalog.jsx   # список товаров категории
│       │   ├── Product.jsx   # карточка товара + размер + addToCart
│       │   ├── Cart.jsx      # корзина с управлением qty
│       │   ├── Login.jsx     # вход по телефону
│       │   ├── Register.jsx  # завершение регистрации (имя/фамилия)
│       │   ├── Account.jsx   # личный кабинет, история заказов
│       │   ├── Checkout.jsx  # оформление: данные доставки
│       │   ├── Payment.jsx   # оплата картой с 3D-превью
│       │   ├── OrderSuccess.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx  # шелл с sidebar, drawer на мобиле
│       │       ├── Dashboard.jsx    # статистика
│       │       ├── Products.jsx     # таблица товаров
│       │       ├── ProductForm.jsx  # форма товара (создание/редактирование)
│       │       ├── Categories.jsx   # категории
│       │       ├── Orders.jsx       # заказы со сменой статусов
│       │       ├── Users.jsx        # пользователи + права
│       │       ├── Content.jsx      # hero/лукбук/селебрити
│       │       └── admin.css        # стили админки
│       │
│       └── pages/Home.css, components/Header.css и т.д.
│
└── data/                      # созданные runtime-данные (в .gitignore)
    ├── db.sqlite
    └── uploads/                # картинки, загруженные через админку
```

---

## Функционал

### Публичная часть

| Страница | Описание |
|---|---|
| `/` | Главная: hero-слайдер с автопрокруткой, популярные товары с пагинацией, лукбук, блок «О бренде», селебрити |
| `/catalog/jackets` | Куртки и верхняя одежда |
| `/catalog/t-shirts` | Футболки |
| `/catalog/hoodies` | Худи (балаклавы Sherpa) |
| `/catalog/pants` | Штаны |
| `/catalog/accessories` | Сумки и аксессуары |
| `/catalog/popular` | Все популярные товары |
| `/product/:id` | Детальная карточка товара + выбор размера |
| `/cart` | Корзина с управлением количеством |
| `/login` | Вход по номеру телефона |
| `/register` | Завершение регистрации (имя, фамилия, чекбокс рассылки) |
| `/account` | Личный кабинет: история заказов со статусами |
| `/checkout` | Оформление заказа: ФИО, телефон, адрес доставки |
| `/payment` | Оплата картой с интерактивной 3D-превью карты |
| `/order/:id/success` | Поздравление с успешным заказом |

#### Маски и валидация форм

Реализованы в `client/src/utils/forms.js`:

- **Телефон** — `+7 (___) ___-__-__`, валидация: 11 цифр, начинается с 7/8
- **Карта** — `0000 0000 0000 0000`, **Luhn-чек**, авто-определение бренда
  (Visa, Mastercard, AmEx, МИР), индикация в лейбле и на превью
- **Срок** — `MM/ГГ`, проверка месяца 1–12 и неистёкшей даты
- **CVC** — `•••` (password), 3–4 цифры
- **Имя владельца** — UPPERCASE латиница, требует имя+фамилия
- **ФИО** — кириллица/латиница/дефис, 2–40 символов
- **Адрес** — 6–200 символов

Ошибки показываются после `blur` или попытки `submit`, поля с ошибкой
подсвечиваются красной обводкой, сообщение появляется с fade-in анимацией.

### Админ-панель `/admin`

| Раздел | Возможности |
|---|---|
| **Дашборд** | Кол-во заказов / выручка / кол-во товаров / кол-во пользователей; новых заказов; последние 8 заказов; разбивка товаров по категориям |
| **Товары** | Поиск, CRUD, загрузка изображения через `multipart/form-data`, выбор категории, размеров, флага «популярное», управление наличием |
| **Категории** | CRUD с порядком сортировки (поле `position`) |
| **Заказы** | Таблица всех заказов, смена статуса прямо в строке (`new` → `paid` → `shipped` → `delivered` / `cancelled`), раскрытие состава заказа inline |
| **Пользователи** | Список зарегистрированных, переключение прав администратора |
| **Контент главной** | Hero-слайды (заголовок, подзаголовок, картинка, ссылка), Лукбук-карточки, Селебрити-плитка |

---

## Схема базы данных

```
categories
├── id            INTEGER PK
├── slug          TEXT UNIQUE   ← jackets, t-shirts, ...
├── name          TEXT          ← человекочитаемое имя
└── position      INTEGER       ← порядок в меню

products
├── id            INTEGER PK
├── category_id   FK → categories.id
├── name          TEXT          ← TommySinny® ShadeV2 Puffer
├── variant       TEXT          ← White / Black / Bordo
├── price         INTEGER       ← в рублях
├── description   TEXT
├── image         TEXT          ← URL или /uploads/file.png
├── sizes         TEXT          ← S,M,L,XL или one size
├── is_popular    INTEGER       ← 0/1, показывать в "популярных"
├── in_stock      INTEGER       ← 0/1
└── created_at    INTEGER       ← Unix-timestamp

users
├── id            INTEGER PK
├── phone         TEXT UNIQUE   ← +7XXXXXXXXXX
├── first_name    TEXT
├── last_name     TEXT
├── is_admin      INTEGER       ← 0/1
├── newsletter    INTEGER       ← 0/1
└── created_at    INTEGER

orders
├── id            INTEGER PK
├── user_id       FK → users.id
├── first_name, last_name, phone, address  TEXT
├── total         INTEGER       ← пересчитывается на сервере
├── status        TEXT          ← new|paid|shipped|delivered|cancelled
├── payment_method TEXT
└── created_at    INTEGER

order_items
├── id            INTEGER PK
├── order_id      FK → orders.id ON DELETE CASCADE
├── product_id    FK → products.id
├── name, variant, image, size  TEXT  (snapshot на момент заказа)
├── price         INTEGER
└── qty           INTEGER

hero_slides    (id, title, subtitle, image, link, position)
lookbook       (id, title, image, position)
celebrities    (id, name, image, position)
site_settings  (key TEXT PK, value TEXT)   ← about_mark_image, about_side_image
```

Миграции выполняются на старте сервера через `CREATE TABLE IF NOT EXISTS`,
вручную ничего применять не нужно.

---

## API-справочник

Все ответы — JSON. Ошибки возвращают `{ error: "сообщение" }` со
статусом 4xx/5xx.

### Публичные endpoints

```
POST  /api/auth/start         { phone } → { user, isNew, needsProfile }
POST  /api/auth/complete      { first_name, last_name, newsletter? } → { user }
GET   /api/auth/me            → { user | null }
POST  /api/auth/logout        → { ok: true }

GET   /api/categories         → [{ id, slug, name, count }]
GET   /api/products           ?category=jackets&popular=1&q=puffer&limit=100
GET   /api/products/:id       → { product }
GET   /api/home               → { slides, popular, lookbook, celebrities, about }

POST  /api/orders             [auth] { items, first_name, ..., address } → { id, total }
GET   /api/orders             [auth] → [orders с items]
GET   /api/orders/:id         [auth] → { order with items }
```

### Админ endpoints (требуют `is_admin`)

```
GET   /api/admin/stats        → счётчики, последние заказы, разбивка
POST  /api/admin/upload       multipart/form-data file=... → { url }

GET   /api/admin/categories
POST  /api/admin/categories   { slug, name, position }
PUT   /api/admin/categories/:id
DELETE /api/admin/categories/:id

GET   /api/admin/products
POST  /api/admin/products     { category_id, name, variant, price, ... }
PUT   /api/admin/products/:id
DELETE /api/admin/products/:id

GET   /api/admin/orders       → все заказы со статусами
PUT   /api/admin/orders/:id   { status }

GET   /api/admin/slides | /api/admin/lookbook | /api/admin/celebrities
POST  /api/admin/slides       { title, subtitle, image, link, position }
PUT   /api/admin/slides/:id
DELETE /api/admin/slides/:id

GET   /api/admin/users
PUT   /api/admin/users/:id    { is_admin }

GET   /api/admin/settings     → { about_mark_image, about_side_image, ... }
PUT   /api/admin/settings     { key1: value1, key2: value2 }
```

---

## Замена изображений

Все картинки в свежеустановленном проекте — placeholder'ы с `placehold.co`.
Заменить можно тремя способами:

### 1. Через админку (рекомендуется)

1. `/admin/products` → выбрать товар → «Изменить»
2. В поле «Изображение» нажать «Загрузить файл»
3. Файл сохранится в `data/uploads/<timestamp>-<rand>.<ext>`
4. URL вида `/uploads/...` запишется в БД

То же для hero-слайдов, лукбука, селебрити (`/admin/content`).

### 2. Через прямую вставку URL

В админке вместо загрузки файла можно вписать любой URL (CDN, S3, etc.) —
сохранится как есть.

### 3. Через SQL (массовая замена)

```bash
sqlite3 data/db.sqlite
UPDATE products SET image = '/uploads/' || id || '.jpg';
```

Файлы залить вручную в `data/uploads/`.

---

## Команды

```bash
npm install                # установка зависимостей
npm run dev                # dev: client (5173) + server (4000) с HMR
npm run dev:client         # только Vite
npm run dev:server         # только Express
npm run build              # сборка фронта в dist/
npm start                  # прод-сервер на 4000 (отдаёт dist/)
npm run seed -- --force    # пересоздать тестовые данные
```

### Очистка БД и стартового состояния

```bash
rm data/db.sqlite          # удалить базу
rm -rf data/uploads/*      # удалить загруженные файлы
npm start                  # БД и seed создадутся заново
```

---

## Деплой на сервер

Конфигурация: **один домен** `sinnybytommy.ru`, отдельный домен под API
не нужен — Express отдаёт и `/api/*`, и собранный фронт с одного порта (4000),
фронт ходит к API по относительным путям → same-origin, без CORS.

### Архитектура продакшена

```
                  HTTPS :443
                      │
          ┌───────────▼───────────┐
          │       Caddy 2         │  ← терминирует TLS (Let's Encrypt)
          │  (контейнер caddy)    │     www → apex редирект
          └───────────┬───────────┘     gzip/zstd, security headers
                      │ HTTP :4000
          ┌───────────▼───────────┐
          │    Node + Express     │  ← /api/* + раздача dist/
          │   (контейнер app)     │
          └───────────┬───────────┘
                      │
                ┌─────▼──────┐
                │ ./data/    │  ← bind-mount хост → контейнер
                │  db.sqlite │     (база и аплоады переживают деплой)
                │  uploads/  │
                └────────────┘
```

### Файлы для деплоя

| Файл | Назначение |
|---|---|
| [`Dockerfile`](Dockerfile) | Multi-stage сборка Node-приложения |
| [`docker-compose.yml`](docker-compose.yml) | Сервисы `app` + `caddy`, тома, сеть |
| [`Caddyfile`](Caddyfile) | Конфиг reverse-proxy с auto-HTTPS |
| [`.env.example`](.env.example) | Шаблон с переменными окружения |
| [`.dockerignore`](.dockerignore) | Что не тянуть в build context |

### DNS-настройка

В DNS-панели регистратора домена `sinnybytommy.ru` добавьте:

| Тип | Хост | Значение | TTL |
|---|---|---|---|
| `A` | `@` | IP адрес сервера | 3600 |
| `A` | `www` | IP адрес сервера | 3600 |

После применения DNS должен резолвиться (`dig sinnybytommy.ru +short` →
ваш IP). Пока не резолвится — Caddy не сможет получить сертификат.

### Подготовка сервера

Минимум: VPS с Ubuntu/Debian, 1 vCPU + 1 GB RAM, открытые порты 80, 443.

```bash
# 1. Установить Docker (на Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# перезайти в SSH чтобы группа docker применилась

# 2. Открыть firewall (если ufw активен)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Развёртывание

```bash
# 1. Склонировать репозиторий
git clone <ваш-git-url> /opt/sinnybytommy
cd /opt/sinnybytommy

# 2. Создать .env
cp .env.example .env
nano .env
# Сгенерировать JWT_SECRET (один раз, потом не менять):
#   openssl rand -hex 32
# Заполнить DOMAIN=sinnybytommy.ru, ACME_EMAIL=ваш@email.ru

# 3. Поднять стек
docker compose up -d --build

# 4. Посмотреть логи (Caddy получает сертификат за ~30 секунд)
docker compose logs -f caddy
# дождаться строчки "certificate obtained successfully"
```

После этого `https://sinnybytommy.ru` открывается, сертификат валиден,
HTTP автоматически редиректит на HTTPS.

### Что переживает перезапуск

Том `./data` биндится с хоста, в нём:
- `db.sqlite` — вся база (товары, заказы, пользователи)
- `uploads/` — загруженные через админку картинки

Сертификаты в named-volume `caddy_data` (тоже переживают рестарт).

### Обновление кода

```bash
cd /opt/sinnybytommy
git pull
docker compose up -d --build
# zero-downtime для пользователей не гарантирован,
# но рестарт укладывается в 1-2 секунды
```

База НЕ удаляется и не сбрасывается — миграции идут идемпотентно через
`CREATE TABLE IF NOT EXISTS`.

### Бэкап

База — один файл, бэкапится тривиально:

```bash
# Локальная копия (на сервере)
cp /opt/sinnybytommy/data/db.sqlite ~/backups/db-$(date +%F).sqlite

# Скачать к себе на машину
scp user@sinnybytommy.ru:/opt/sinnybytommy/data/db.sqlite ./db-backup.sqlite

# Или копию аплоадов целиком
tar czf uploads-$(date +%F).tar.gz -C /opt/sinnybytommy/data uploads/
```

Можно повесить в cron еженедельный бэкап в `/var/backups/`.

### Логи

```bash
docker compose logs -f app     # Express (запросы, seed, ошибки)
docker compose logs -f caddy   # обращения, выпуск сертификатов
docker compose logs --tail=200 # последние 200 строк всех сервисов
```

### Smoke-тест после деплоя

```bash
# Сертификат и редирект работают
curl -I https://sinnybytommy.ru
# → HTTP/2 200, header Strict-Transport-Security есть

# API живой
curl https://sinnybytommy.ru/api/categories
# → JSON со списком категорий

# Залогиниться как админ:
# открыть https://sinnybytommy.ru/login → +7 (900) 000-00-00
```

### Если нужен второй домен под API позже

Сейчас не нужен. Если когда-нибудь захотите выделить API на `api.sinnybytommy.ru`
(например, чтобы разнести фронт по CDN):

1. В `Caddyfile` добавить блок `api.sinnybytommy.ru { reverse_proxy app:4000 }`
2. На фронте сменить `fetch('/api/...')` на `fetch(import.meta.env.VITE_API_URL + ...)`
3. На Express добавить CORS-middleware с allowlist
4. Cookie выставить с `Domain=.sinnybytommy.ru` чтобы шарилась между поддоменами

Для дипломной защиты избыточно — оставляем монолит.

---

## Возможные проблемы

### `Error: Cannot find module 'better-sqlite3'`

Нативный модуль не собрался. Решение:

```bash
npm rebuild better-sqlite3
# или, если в проекте Node-версия ≠ глобальной:
npx node-gyp rebuild
```

### Порт 4000 / 5173 уже занят

Найти и убить процесс:

```bash
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Карточки товаров без картинок

После `npm install` БД пустая, надо запустить `npm start` хотя бы один раз —
сидер наполнит таблицы.

### Админка показывает «Доступ запрещён»

Текущий пользователь не админ. Войдите как `+7 (900) 000-00-00` или сделайте
админом существующего пользователя через SQL/UI.

### Сменился порт API

Если меняете порт сервера — поправьте `vite.config.js` (поле `proxy`) и
перезапустите `npm run dev`.

### Хочется сменить JWT-секрет в продакшене

В `.env`:

```
JWT_SECRET=новый-длинный-случайный-секрет
```

Затем `docker compose up -d` — все существующие сессии инвалидируются
(пользователям придётся войти заново).

### Caddy не может получить сертификат

```
[ERROR] could not get certificate ... timeout
```

Причины и решения:

1. **DNS не резолвится** — проверьте `dig sinnybytommy.ru +short`
2. **Порт 80 закрыт** — Let's Encrypt валидирует через HTTP-01 challenge
3. **Cloudflare-прокси включен** — выключите оранжевое облачко, или
   используйте DNS-01 challenge (нужен API-токен Cloudflare)
4. **Достигнут rate-limit** Let's Encrypt — подождите час; в `Caddyfile`
   можно временно поставить `acme_ca https://acme-staging-v02.api.letsencrypt.org/directory`
   для тестов

### `better-sqlite3` не собирается в Docker

Уже учтено: в `Dockerfile` ставятся `python3 make g++` для компиляции
нативного модуля. Если меняли версию Node — пересоберите образ:

```bash
docker compose build --no-cache app
```

### Контейнер app падает с `EACCES: permission denied`

База или uploads не имеют прав на запись. Том `./data` принадлежит хосту:

```bash
sudo chown -R 1000:1000 ./data    # 1000 — UID пользователя `node` в alpine
```

### Хочу запускать без Caddy (например, за уже существующим nginx)

Уберите сервис `caddy` из `docker-compose.yml`, на сервисе `app` поменяйте
`expose` на `ports: ["4000:4000"]`, в вашем nginx настройте `proxy_pass
http://localhost:4000;`.

---

## Адаптивность

| Брейкпоинт | Поведение |
|---|---|
| `> 1024px` | Десктоп: full layout, 4 колонки в каталоге, sidebar в админке |
| `768–1024px` | Планшет: 3 колонки, тот же layout |
| `520–768px` | Малый планшет: 2 колонки, hamburger в шапке |
| `< 520px` | Мобила: 1–2 колонки, в шапке только текст-логотип, в админке drawer-меню |

Все изображения с фиксированным `aspect-ratio: 1/1` (товары, лукбук,
селебрити, mark/side в About) — сохраняют квадратность независимо от
ширины колонки.

---

## Анимации

- **Page transitions** — CSS `@keyframes` opacity 320ms (без задержки на exit)
- **Reveal on scroll** — CSS `.reveal` с `--reveal-delay` через CSS-переменные
- **Hero slider** — кросс-fade слайдов 900ms, автопрокрутка 6с с pause-on-hover
- **3D Card on Payment** — Framer Motion `whileHover={{ rotateY, rotateX }}`
- **Side menu** — Framer Motion AnimatePresence с slide-in
- **Цена / счётчик корзины** — мгновенное обновление через Zustand
- **Уважение `prefers-reduced-motion`** — все анимации отключаются

GPU-only трансформы (`opacity`, `transform: translate3d`), `will-change`
расставлен только на действительно анимируемые элементы.

---

## Лицензия и атрибуция

Проект сделан в рамках дипломной работы. Бренд **TOMMYSINNY®** — авторская
концепция. Иконки-драконы, монограммы, логотип — assets из дипломного Figma.

© 2025–2026 TOMMYSINNY®. Diploma project.
