# ============================================================
# HS Education — Dockerfile
# Single file, two named targets: frontend & backend
#
# Northflank settings:
#   Dockerfile path : Dockerfile
#   Build context   : . (root)
#   Frontend target : frontend
#   Backend target  : backend
#
# Frontend env vars (set in Northflank):
#   PORT=3000
#   REACT_APP_API_URL=https://p02--hseducation--wd2sd44bwz9b.code.run
#
# Backend env vars (set in Northflank):
#   PORT=5000
#   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
#   FRONTEND_URL=https://p01--hseducation--wd2sd44bwz9b.code.run
# ============================================================


# ── Stage 1: Build React app ─────────────────────────────
FROM node:20-alpine AS react-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/public ./public
COPY frontend/src    ./src

# REACT_APP_API_URL is passed as build arg from Northflank
# e.g. https://p02--hseducation--wd2sd44bwz9b.code.run
ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build


# ── TARGET: frontend ─────────────────────────────────────
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
FROM node:20-alpine AS backend

WORKDIR /app

COPY backend/js/package.json backend/js/package-lock.json ./
RUN npm install --omit=dev

COPY backend/js/ ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-5000}/healthz || exit 1

EXPOSE 5000

CMD ["node", "server.js"]
