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

WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000

# Копируем только то, что нужно для работы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist          ./dist
COPY --from=builder /app/server        ./server
COPY --from=builder /app/package.json  ./package.json

# Том для базы и загруженных файлов
RUN mkdir -p /app/data/uploads && chown -R node:node /app/data
USER node

EXPOSE 4000
CMD ["node", "server/index.js"]
