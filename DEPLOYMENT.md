# Step-by-step deployment guide – Spiritual Katha

Deploy the **backend** and **frontend** separately, then connect them. Use **MongoDB Atlas** for the database.

---

## Overview

| Part        | Where to deploy     | Result                          |
|------------|---------------------|----------------------------------|
| Database   | MongoDB Atlas       | Connection string (URI)          |
| Backend    | Render / Railway    | e.g. `https://your-api.onrender.com` |
| Frontend   | Vercel / Netlify    | e.g. `https://your-app.vercel.app`   |

---

## Step 1: MongoDB Atlas (database)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign in (or create an account).
2. **Create a cluster** (e.g. free M0):
   - Click **Build a Database** → choose **M0 FREE** → region near you → **Create**.
3. **Create a database user:**
   - Security → **Database Access** → **Add New Database User**.
   - Username and password (save the password). Role: **Atlas Admin** (or Read/Write to your DB). **Add User**.
4. **Allow network access:**
   - Security → **Network Access** → **Add IP Address**.
   - For “anywhere” access: **Allow Access from Anywhere** (`0.0.0.0/0`). **Confirm**.
5. **Get connection string:**
   - **Database** → **Connect** → **Drivers** → copy the URI.
   - It looks like: `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your DB user password.
   - Add database name: `?retryWrites=true&w=majority` → change to `/spiritual-katha?retryWrites=true&w=majority`.
   - **Final URI:** `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/spiritual-katha?retryWrites=true&w=majority`
   - Save this; you’ll use it as `MONGODB_URI` for the backend.

---

## Step 2: Deploy backend (e.g. Render)

### 2.1 Create backend service on Render

1. Go to [render.com](https://render.com) and sign in (GitHub is fine).
2. **New** → **Web Service**.
3. Connect your GitHub repo: **Raveena322/Spiritual-site** (or your fork).
4. Settings:
   - **Name:** `spiritual-katha-api` (or any name).
   - **Root Directory:** leave empty (we’ll set build/start for backend only).
   - **Runtime:** **Node**.
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Instance type:** Free (or paid if you prefer).

### 2.2 Environment variables (backend on Render)

In the **Environment** section, add:

| Key               | Value |
|-------------------|--------|
| `MONGODB_URI`     | Your full Atlas URI from Step 1 |
| `JWT_SECRET`      | A long random string (e.g. 32+ characters) |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID (e.g. `spiritual-app-99c47`) |
| `NODE_ENV`        | `production` |

(Optional, for emails: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — see `backend/.env.example`.)

Save. Render will build and deploy. Note your backend URL, e.g. **`https://spiritual-katha-api.onrender.com`**.

---

## Step 3: Deploy frontend (e.g. Vercel)

### 3.1 Create frontend project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New** → **Project** → import **Raveena322/Spiritual-site** (or your repo).
3. Settings:
   - **Framework Preset:** Create React App.
   - **Root Directory:** `frontend` (important).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `build` (default).

### 3.2 Environment variable (frontend on Vercel)

In **Settings** → **Environment Variables**, add:

| Key                  | Value |
|----------------------|--------|
| `REACT_APP_API_URL`  | Your backend URL + `/api`, e.g. `https://spiritual-katha-api.onrender.com/api` |

Redeploy so the variable is applied. Note your frontend URL, e.g. **`https://spiritual-katha.vercel.app`**.

---

## Step 4: Firebase (Google Sign-in)

1. Go to [Firebase Console](https://console.firebase.google.com) → your project (e.g. spiritual-app-99c47).
2. **Authentication** → **Sign-in method** → **Google** → Enable.
3. **Authentication** → **Settings** → **Authorized domains**:
   - Add your frontend domain, e.g. `spiritual-katha.vercel.app` (and any custom domain you use).
   - `localhost` is usually already there for dev.

---

## Step 5: CORS (if backend blocks frontend)

If your backend is on Render and you see CORS errors in the browser, the app already uses `app.use(cors())`. If you restricted CORS by origin, add your frontend URL (e.g. `https://spiritual-katha.vercel.app`) to the allowed list in `backend/server.js` if you change it later.

---

## Step 6: Create first Guru after deploy

- **Option A:** Use the app: open your frontend URL → **Register** → choose role **Guru** → register.
- **Option B:** If you have MongoDB Atlas shell or Compass, you can create a user in the `users` collection (with bcrypt-hashed password and role `guru`). Or run the seed script locally once with `MONGODB_URI` set to your **production** Atlas URI:
  ```bash
  cd backend
  set MONGODB_URI=your_production_atlas_uri
  node scripts/seedGuru.js
  ```
  Then log in with `guru@example.com` / `password123`.

---

## Quick checklist

- [ ] MongoDB Atlas: cluster created, user created, Network Access (e.g. 0.0.0.0/0), URI copied.
- [ ] Backend on Render: repo connected, root/build/start set for `backend`, env vars set (MONGODB_URI, JWT_SECRET, FIREBASE_PROJECT_ID, NODE_ENV).
- [ ] Frontend on Vercel: repo connected, root = `frontend`, REACT_APP_API_URL = backend URL + `/api`.
- [ ] Firebase: Google sign-in enabled, frontend domain in Authorized domains.
- [ ] First Guru created (register in app or seed script with production URI).
- [ ] Test: open frontend URL → register/login (email and Google) → create slot (Guru) → book (Devotee) → confirm and print.

---

## Alternative: Netlify for frontend

1. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git** → choose repo.
2. **Base directory:** `frontend`.
3. **Build command:** `npm run build`.
4. **Publish directory:** `frontend/build`.
5. **Environment variables:** `REACT_APP_API_URL` = `https://your-backend-url/api`.
6. Deploy.

---

## Alternative: Railway for backend

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select repo.
2. Set **Root Directory** to `backend` (or add a `railway.json` / use one-service setup).
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `FIREBASE_PROJECT_ID`, `NODE_ENV`.
4. Railway assigns a URL; use that as your API URL (e.g. `https://xxx.railway.app`) and set `REACT_APP_API_URL` to `https://xxx.railway.app/api`.

---

## Troubleshooting

- **“Database not connected”:** Check Atlas URI, password, and Network Access (IP or 0.0.0.0/0). See **FIX_DATABASE.md**.
- **“Cannot reach server”:** Frontend can’t reach backend. Confirm `REACT_APP_API_URL` is correct and backend is running (Render/Railway dashboard).
- **Google Sign-in fails on production:** Add your production domain to Firebase **Authorized domains**.
- **CORS error:** Backend uses `cors()`; if you later restrict origins, include your frontend URL.
