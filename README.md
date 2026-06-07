# HS Education
### Empowering Australian Learners | hseducation.com.au

Full-stack Australian charity website. React frontend + Node.js/Express backend + PostgreSQL. Deployed on Northflank.

---

## File Structure

```
HSEducation/
│
├── Dockerfile                ← Single file — two targets: frontend & backend
├── nginx.conf                ← Nginx config (SPA routing + API proxy)
├── docker-entrypoint.sh      ← Injects PORT & BACKEND_URL into nginx at runtime
├── requirements.txt          ← All packages — frontend and backend
├── README.md                 ← This file
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       ├── images/index.js         ← Image URLs (Unsplash CDN)
│       ├── components/
│       │   ├── GlobalStyles.jsx
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
    │   ├── server.js               ← Express API
    │   ├── db.js                   ← PostgreSQL + in-memory fallback
    │   ├── package.json
    │   └── routes/
    │       ├── donations.js
    │       ├── programs.js
    │       └── providers.js
    └── app_db/
        ├── 01_schema.sql           ← Database tables
        ├── 02_seed.sql             ← Seed data
        └── 03_queries.sql          ← Admin queries
```

---

## Requirements

See `requirements.txt` for all packages.

### Frontend (`frontend/`)
| Package       | Version | Purpose                       |
|---------------|---------|-------------------------------|
| react         | 18.2.0  | UI framework                  |
| react-dom     | 18.2.0  | DOM rendering                 |
| react-scripts | 5.0.1   | Webpack/Babel build tooling   |
| ajv           | 8.17.1  | JSON schema (Node 17+ fix)    |

### Backend (`backend/js/`)
| Package  | Version | Purpose                |
|----------|---------|------------------------|
| express  | 4.18.2  | Web framework          |
| pg       | 8.11.3  | PostgreSQL client      |
| helmet   | 7.1.0   | Security headers       |
| cors     | 2.8.5   | Cross-origin requests  |
| morgan   | 1.10.0  | HTTP request logging   |
| nodemon  | 3.0.2   | Dev auto-restart       |

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

## Northflank Deployment

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "HS Education initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hseducation.git
git push -u origin main
```

---

### Step 2 — Create Project

1. Log in at **northflank.com**
2. **New Project** → name: `hs-education` → **Create**

---

### Step 3 — Add PostgreSQL Addon

1. Inside project → **New Resource** → **Addon** → **PostgreSQL 16**
2. Name: `hse-db` → **Create**
3. Click addon → **Connection Details** → save Host, Port, DB, User, Password

---

### Step 4 — Deploy Backend

1. **New Service** → **Deployment Service** → **Build from source**
2. Connect GitHub → select repo
3. **Build settings:**

   | Field           | Value        |
   |-----------------|--------------|
   | Dockerfile path | `Dockerfile` |
   | Build context   | `.`          |
   | Docker target   | `backend`    |

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
6. **Create Service** → wait for ✅

---

### Step 5 — Load Database (once only)

Backend service → **Shell** tab:

```bash
node -e "
const db=require('./db'),fs=require('fs');
db.query(fs.readFileSync('./app_db/01_schema.sql','utf8'))
  .then(()=>db.query(fs.readFileSync('./app_db/02_seed.sql','utf8')))
  .then(()=>{console.log('Done');process.exit(0);})
  .catch(e=>{console.error(e.message);process.exit(1);});
"
```

---

### Step 6 — Deploy Frontend

1. **New Service** → **Deployment Service** → **Build from source**
2. Same repo
3. **Build settings:**

   | Field           | Value        |
   |-----------------|--------------|
   | Dockerfile path | `Dockerfile` |
   | Build context   | `.`          |
   | Docker target   | `frontend`   |

4. **Networking** → port `3000` → HTTP → Public **ON** ✅
5. **Environment variables:**
   ```
   PORT=3000
   BACKEND_URL=http://<backend-internal-hostname>:5000
   ```
   > Get the backend internal hostname from: backend service → **Networking** → **Internal DNS**

6. **Create Service** → wait for ✅

---

### Step 7 — Connect Domain

1. Frontend service → **Networking** → **Add Domain**
2. Enter `hseducation.com.au` and `www.hseducation.com.au`
3. Add CNAME from Northflank to your domain registrar
4. SSL is auto-provisioned ✅

---

### Step 8 — Verify

- Website: `https://hseducation.com.au`
- API: `https://<backend-url>/healthz`

```json
{ "status": "ok", "service": "HS Education API", "database": "postgresql" }
```

---

## Local Development

```bash
# Terminal 1 — Backend
cd backend/js
npm install
node server.js
# http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install --legacy-peer-deps
npm start
# http://localhost:3000
```

> Backend auto-switches to in-memory store when PostgreSQL is not available. All 9 programs and 4 providers are preloaded.

---

## Environment Variables

### Backend
| Variable       | Example                      | Description           |
|----------------|------------------------------|-----------------------|
| `PORT`         | `5000`                       | API listen port       |
| `DB_HOST`      | `abc.northflank.app`         | PostgreSQL host       |
| `DB_PORT`      | `5432`                       | PostgreSQL port       |
| `DB_NAME`      | `hseducation`                | Database name         |
| `DB_USER`      | `hse_user`                   | Database user         |
| `DB_PASSWORD`  | `your_password`              | Database password     |
| `FRONTEND_URL` | `https://hseducation.com.au` | CORS allowed origin   |

### Frontend
| Variable       | Example                           | Description             |
|----------------|-----------------------------------|-------------------------|
| `PORT`         | `3000`                            | Nginx listen port       |
| `BACKEND_URL`  | `http://hse-backend.internal:5000`| Backend internal URL    |

---

## Charity Details

| Field        | Value                                  |
|--------------|----------------------------------------|
| Organisation | HS Education                           |
| ABN          | 12 345 678 901                         |
| ACNC Status  | Registered Charity                     |
| DGR Status   | Category 1 DGR Endorsed                |
| Website      | hseducation.com.au                     |
| Email        | info@hseducation.com.au                |
| Phone        | (02) 8880 1234                         |
| Address      | Level 4, 10 Spring St, Sydney NSW 2000 |
