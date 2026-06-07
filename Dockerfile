# ============================================================
# HS Education — Dockerfile
# Two named build targets in one file:
#
#   TARGET: frontend
#   Northflank → Dockerfile path: Dockerfile
#   Northflank → Docker target:   frontend
#
#   TARGET: backend
#   Northflank → Dockerfile path: Dockerfile
#   Northflank → Docker target:   backend
#
# Build context: . (root) for both services
# ============================================================


# ── STAGE 1: Build React app ─────────────────────────────
FROM node:20-alpine AS react-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/public ./public
COPY frontend/src    ./src

ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build


# ── TARGET: frontend ─────────────────────────────────────
# Nginx serves the React build
# Northflank service 1 — port 3000 — PUBLIC
FROM nginx:1.25-alpine AS frontend

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf           /etc/nginx/conf.d/app.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=react-builder /app/build /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


# ── TARGET: backend ──────────────────────────────────────
# Node.js Express API + PostgreSQL
# Northflank service 2 — port 5000 — INTERNAL
FROM node:20-alpine AS backend

WORKDIR /app

COPY backend/js/package.json backend/js/package-lock.json ./
RUN npm install --omit=dev

COPY backend/js/ ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-5000}/healthz || exit 1

EXPOSE 5000

CMD ["node", "server.js"]
