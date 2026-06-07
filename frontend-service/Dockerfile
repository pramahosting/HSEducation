# ============================================================
# HS Education — Frontend Service
# Northflank: set build context to "frontend-service" folder
# ============================================================

# Stage 1: Build React app
FROM node:20-alpine AS builder

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

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf           /etc/nginx/conf.d/app.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=builder /app/build /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
