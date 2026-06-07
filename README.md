# HS Education
### Empowering Australian Learners | hseducation.com.au

A full-stack Australian charity website — React frontend served by Nginx, Node.js + Express backend, PostgreSQL database. Deployed on Northflank.

---

## Project Structure

```
HSEducation/
│
├── Dockerfile                   ← Single Dockerfile — two build targets (frontend / backend)
├── nginx.conf                   ← Nginx SPA config (gzip, caching, SPA routing)
├── docker-entrypoint.sh         ← Injects PORT env var into Nginx at runtime
├── requirements.txt             ← All packages — frontend and backend
├── .dockerignore
├── .gitignore
├── README.md                    ← This file
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx              ← Root — imports all pages
│       ├── index.js             ← React entry point
│       ├── images/
│       │   └── index.js         ← Image URLs (Unsplash CDN)
│       ├── components/
│       │   ├── GlobalStyles.jsx ← All CSS
│       │   ├── Nav.jsx
│       │   ├── Footer.jsx
│       │   ├── Logo.jsx
│       │   └── Icon.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── AboutPage.jsx
│           ├── ProjectsPage.jsx
│           ├── ImpactPage.jsx
│           ├── DonatePage.jsx
│           └── LegalPage.jsx
│
└── backend/
    ├── js/
    │   ├── server.js            ← Express API server
    │   ├── db.js                ← PostgreSQL + in-memory fallback
    │   ├── package.json
    │   └── routes/
    │       ├── donations.js
    │       ├── programs.js
    │       └── providers.js
    └── app_db/
        ├── 01_schema.sql        ← Table definitions
        ├── 02_seed.sql          ← Seed data
        └── 03_queries.sql       ← Admin queries
```

---

## Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React 18, JSX, CSS Custom Properties |
| Web Server | Nginx 1.25 Alpine                    |
| Backend    | Node.js 20, Express 4                |
| Database   | PostgreSQL 16                        |
| Container  | Docker (multi-stage, single file)    |
| Hosting    | Northflank                           |

---

## Requirements (`requirements.txt`)

### Frontend
| Package       | Version | Purpose                            |
|---------------|---------|------------------------------------|
| react         | 18.2.0  | UI framework                       |
| react-dom     | 18.2.0  | DOM rendering                      |
| react-scripts | 5.0.1   | Build tooling (webpack, babel)     |
| ajv           | 8.17.1  | JSON schema (Node 17+ compat fix)  |

### Backend
| Package  | Version | Purpose                   |
|----------|---------|---------------------------|
| express  | 4.18.2  | Web framework             |
| pg       | 8.11.3  | PostgreSQL client         |
| helmet   | 7.1.0   | Security headers          |
| cors     | 2.8.5   | Cross-origin requests     |
| morgan   | 1.10.0  | HTTP request logging      |
| nodemon  | 3.0.2   | Dev auto-restart (dev only)|

---

## API Endpoints

| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| GET    | `/healthz`                  | Health check           |
| GET    | `/api/programs`             | List all programs      |
| GET    | `/api/programs/:id`         | Single program         |
| POST   | `/api/programs`             | Create program         |
| PUT    | `/api/programs/:id`         | Update program         |
| DELETE | `/api/programs/:id`         | Delete program         |
| GET    | `/api/donations`            | List all donations     |
| POST   | `/api/donations`            | Submit donation        |
| GET    | `/api/donations/:id`        | Single donation        |
| PATCH  | `/api/donations/:id/status` | Update status          |
| GET    | `/api/providers`            | List payment providers |
| POST   | `/api/providers`            | Add provider           |
| PUT    | `/api/providers/:id`        | Update provider        |
| DELETE | `/api/providers/:id`        | Remove provider        |

---

## Northflank Deployment — Step by Step

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "HS Education initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hseducation.git
git push -u origin main
```

---

### Step 2 — Create Northflank Project

1. Log in at **northflank.com**
2. **New Project** → name: `hs-education` → **Create**

---

### Step 3 — Add PostgreSQL Addon

1. Inside project → **New Resource** → **Addon** → **PostgreSQL 16**
2. Name: `hse-db` → **Create Addon**
3. Click addon → **Connection Details** → save Host, Port, DB, User, Password

---

### Step 4 — Deploy Backend Service

1. **New Service** → **Deployment Service** → **Build from source**
2. Connect GitHub → select repo
3. **Build settings:**

   | Field              | Value      |
   |--------------------|------------|
   | Dockerfile path    | `Dockerfile` |
   | Build context      | `.` (root) |
   | **Docker target**  | **`backend`** |

4. **Networking** → port `5000` → HTTP → Public **OFF**
5. **Environment variables:**
   ```
   PORT=5000
   DB_HOST=<addon host>
   DB_PORT=5432
   DB_NAME=<addon database>
   DB_USER=<addon username>
   DB_PASSWORD=<addon password>
   FRONTEND_URL=https://hseducation.com.au
   ```
6. **Create Service** → wait for green ✅

---

### Step 5 — Load Database Schema (once only)

Backend service → **Shell** tab → run:

```bash
node -e "
const db=require('./db'), fs=require('fs');
db.query(fs.readFileSync('./app_db/01_schema.sql','utf8'))
  .then(()=>db.query(fs.readFileSync('./app_db/02_seed.sql','utf8')))
  .then(()=>{ console.log('Database ready'); process.exit(0); })
  .catch(e=>{ console.error(e.message); process.exit(1); });
"
```

---

### Step 6 — Deploy Frontend Service

1. **New Service** → **Deployment Service** → **Build from source**
2. Same GitHub repo
3. **Build settings:**

   | Field              | Value        |
   |--------------------|--------------|
   | Dockerfile path    | `Dockerfile` |
   | Build context      | `.` (root)   |
   | **Docker target**  | **`frontend`** |

4. **Networking** → port `3000` → HTTP → Public **ON** ✅
5. **Environment variables:**
   ```
   PORT=3000
   ```
6. **Create Service** → wait for green ✅

---

### Step 7 — Connect hseducation.com.au

1. Frontend service → **Networking** → **Add Domain**
2. Enter `hseducation.com.au` and `www.hseducation.com.au`
3. Add the CNAME Northflank provides to your domain registrar
4. SSL is auto-provisioned ✅

---

### Step 8 — Verify

- **Website:** `https://hseducation.com.au`
- **API health:** `https://<backend-url>/healthz`

```json
{ "status": "ok", "service": "HS Education API", "database": "postgresql" }
```

---

### Auto-Deploy on Push

```bash
git add .
git commit -m "Update content"
git push origin main
# Northflank rebuilds and redeploys automatically ✅
```

---

## Local Development (no Docker needed)

```bash
# Terminal 1 — Backend
cd backend/js
npm install
node server.js
# Running at http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install --legacy-peer-deps
npm start
# Running at http://localhost:3000
```

> Without PostgreSQL, backend auto-uses in-memory store. All 9 programs and 4 providers are preloaded. Fully functional — data resets on restart.

---

## Environment Variables

### Backend
| Variable       | Example                        | Description              |
|----------------|--------------------------------|--------------------------|
| `PORT`         | `5000`                         | API port                 |
| `DB_HOST`      | `abc.northflank.app`           | PostgreSQL host          |
| `DB_PORT`      | `5432`                         | PostgreSQL port          |
| `DB_NAME`      | `hseducation`                  | Database name            |
| `DB_USER`      | `hse_user`                     | Database username        |
| `DB_PASSWORD`  | `your_password`                | Database password        |
| `FRONTEND_URL` | `https://hseducation.com.au`   | CORS allowed origin      |

### Frontend
| Variable | Example | Description      |
|----------|---------|------------------|
| `PORT`   | `3000`  | Nginx listen port|

---

## Charity Registration

| Detail       | Value                                  |
|--------------|----------------------------------------|
| Organisation | HS Education                           |
| ABN          | 12 345 678 901                         |
| ACN          | 634 891 234                            |
| ACNC Status  | Registered Charity                     |
| DGR Status   | Category 1 DGR Endorsed                |
| Website      | hseducation.com.au                     |
| Email        | info@hseducation.com.au                |
| Phone        | (02) 8880 1234                         |
| Address      | Level 4, 10 Spring St, Sydney NSW 2000 |
