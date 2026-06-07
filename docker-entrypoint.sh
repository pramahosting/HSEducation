#!/bin/sh
# ============================================================
# HS Education — Docker Entrypoint
# Injects PORT and BACKEND_URL into nginx config at runtime
# Northflank sets both variables automatically
# ============================================================
export PORT=${PORT:-3000}
export BACKEND_URL=${BACKEND_URL:-http://localhost:5000}

echo "[HS Education] Frontend starting on port: $PORT"
echo "[HS Education] Backend URL: $BACKEND_URL"

envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/conf.d/app.conf > /tmp/app.conf
cp /tmp/app.conf /etc/nginx/conf.d/app.conf

exec "$@"
