#!/bin/sh
# Bind-mount тома ./data перетирает владельца, выставленного в Dockerfile.
# Запускаемся как root: чиним owner и права, потом сбрасываемся в node.
set -e

mkdir -p /app/data/uploads
chown -R node:node /app/data
chmod -R u+rwX /app/data

# Сбрасываем привилегии и запускаем CMD (см. Dockerfile)
exec su-exec node:node "$@"
