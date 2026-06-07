#!/bin/sh
export PORT=${PORT:-3000}
echo "[HS Education] Frontend starting on port: $PORT"
envsubst '${PORT}' < /etc/nginx/conf.d/app.conf > /tmp/app.conf
cp /tmp/app.conf /etc/nginx/conf.d/app.conf
exec "$@"
