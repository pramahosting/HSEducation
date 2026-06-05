# HS Education — Northflank Deployment Guide

## Architecture on Northflank

```
Northflank Project: hs-education
│
├── Service: hse-frontend    (Dockerfile.frontend → Nginx → port 3000)
├── Service: hse-backend     (Dockerfile.backend  → Node.js → port 5000)
└── Addon:   hse-db          (PostgreSQL 16)
```

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "HS Education - initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hseducation.git
git push -u origin main
```

---

## Step 2 — Create Northflank Project

1. Log in at **northflank.com**
2. Click **New Project** → name it `hs-education` → Create

---

## Step 3 — Add PostgreSQL Database

1. Inside the project → **New Resource** → **Addon**
2. Choose **PostgreSQL** → version 16
3. Name it `hse-db`
4. Note down the connection details Northflank gives you:
   - Host, Port, Database, Username, Password

---

## Step 4 — Deploy Backend Service

1. **New Service** → **Deployment Service** → **Build from source**
2. Connect GitHub → select your repo
3. Build settings:
   - Build type: `Dockerfile`
   - Dockerfile path: `Dockerfile.backend`
   - Build context: `.`
4. Networking → Add port:
   - Port: `5000`, Protocol: `HTTP`, **Public: OFF** (internal only)
5. Environment variables → Add all of these:
   ```
   PORT=5000
   DB_HOST=<from addon>
   DB_PORT=5432
   DB_NAME=<from addon>
   DB_USER=<from addon>
   DB_PASSWORD=<from addon>
   FRONTEND_URL=https://your-frontend-url.northflank.app
   ```
6. Click **Create Service** ✅

### Run database schema (once only)
After backend deploys, open its shell in Northflank console and run:
```bash
node -e "
const pool = require('./db');
const fs = require('fs');
pool.query(fs.readFileSync('./app_db_init/schema.sql','utf8'))
  .then(()=>{ console.log('Schema created'); process.exit(0); })
  .catch(e=>{ console.error(e); process.exit(1); });
"
```
Or connect directly to the PostgreSQL addon and run `01_schema.sql` then `02_seed.sql`.

---

## Step 5 — Deploy Frontend Service

1. **New Service** → **Deployment Service** → **Build from source**
2. Same repo, different Dockerfile:
   - Build type: `Dockerfile`
   - Dockerfile path: `Dockerfile.frontend`
   - Build context: `.`
3. Networking → Add port:
   - Port: `3000`, Protocol: `HTTP`, **Public: ON** ✅
4. Environment variables:
   ```
   PORT=3000
   ```
5. Click **Create Service** ✅

---

## Step 6 — Connect hseducation.com.au

1. Frontend service → **Networking** → **Add Domain**
2. Enter `hseducation.com.au` and `www.hseducation.com.au`
3. Northflank provides a CNAME — add it to your domain registrar:
   - `www` CNAME → `xxxx.northflank.app`
   - Root domain: use ALIAS/ANAME or redirect `@` → `www`
4. SSL certificate is auto-provisioned ✅

---

## Step 7 — Auto-deploy on Push

Every `git push origin main` triggers automatic rebuild and zero-downtime redeploy on Northflank.

---

## Local Docker Testing (before deploying)

```bash
# Build and start all services
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# API test → http://localhost:5000/healthz

# Stop everything
docker-compose down
```

---

## Environment Variables Reference

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | API port (Northflank sets automatically) |
| `DB_HOST` | PostgreSQL host (from Northflank addon) |
| `DB_PORT` | PostgreSQL port (usually 5432) |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend
| Variable | Description |
|----------|-------------|
| `PORT` | Nginx port (Northflank sets automatically) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthz` | Health check |
| GET | `/api/programs` | List all programs |
| GET | `/api/programs/:id` | Single program |
| POST | `/api/programs` | Create program |
| GET | `/api/donations` | List donations |
| POST | `/api/donations` | Submit donation |
| GET | `/api/providers` | List payment providers |
