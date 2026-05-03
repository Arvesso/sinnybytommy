# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS builder

# better-sqlite3 — нативный модуль, нужен компилятор
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Сначала только манифесты — лучше кешируется при `docker compose build`
COPY package.json package-lock.json* ./
RUN npm ci

# Копируем исходники и собираем фронт
COPY . .
RUN npm run build

# Чистим dev-зависимости, оставляя нативный binding для runtime
RUN npm prune --omit=dev


# ── Runtime stage ────────────────────────────────────────
FROM node:20-alpine

# su-exec — позволяет дропать привилегии в entrypoint (~30 KB, alpine-стандарт)
RUN apk add --no-cache su-exec

WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000

# Копируем только то, что нужно для работы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist          ./dist
COPY --from=builder /app/server        ./server
COPY --from=builder /app/package.json  ./package.json

# Entrypoint фиксит owner на bind-mount-томе перед стартом приложения
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# НЕ ставим USER node — entrypoint сам сбрасывает привилегии
EXPOSE 4000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server/index.js"]
