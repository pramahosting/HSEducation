#!/bin/sh
# ============================================================
# Injects PORT environment variable into nginx config
# Northflank sets PORT dynamically — defaults to 3000
# ============================================================
export PORT=${PORT:-3000}
echo "[entrypoint] Frontend starting on port $PORT"
envsubst '${PORT}' < /etc/nginx/conf.d/app.conf > /tmp/app.conf
cp /tmp/app.conf /etc/nginx/conf.d/app.conf
exec "$@"
