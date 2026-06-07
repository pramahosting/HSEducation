#!/bin/sh
export PORT=${PORT:-3000}
echo "[frontend] Starting on port $PORT"
envsubst '${PORT}' < /etc/nginx/conf.d/app.conf > /tmp/app.conf
cp /tmp/app.conf /etc/nginx/conf.d/app.conf
exec "$@"
