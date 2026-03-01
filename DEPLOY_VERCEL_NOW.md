# Deploy Spiritual Katha to Vercel (step-by-step)

Your project is **build-ready**. Follow these steps to deploy.

---

## 1. Push latest code to GitHub

Make sure all changes are pushed:

```bash
cd "c:\Users\asus\Downloads\Spiritual-site-master\Spiritual-site-master"
git add -A
git status
git commit -m "Prepare Vercel deployment"   # if there are changes
git push origin master
```

---

## 2. Open Vercel and import the project

1. Go to **https://vercel.com** and sign in (use **GitHub**).
2. Click **Add New…** → **Project**.
3. Import the repo **Raveena322/Spiritual-site** (or your fork).
4. Click **Import**.

---

## 3. Configure the project (important)

Before clicking **Deploy**, set these:

### General

- **Framework Preset:** Other (we use custom `vercel.json`).
- **Root Directory:** leave **empty** (use repo root).
- **Build Command:** `npm run build`
- **Output Directory:** leave empty (not used; `app.js` serves the app).
- **Install Command:** `npm install`

### Environment variables

Click **Environment Variables** and add (for **Production**):

| Name | Value |
|------|--------|
| `MONGODB_URI` | `mongodb+srv://misskhicher_db_user:skRDvALW0u22jOln@cluster0.yt1xmyv.mongodb.net/spiritual-katha?retryWrites=true&w=majority` |
| `JWT_SECRET` | A long random string (e.g. 40+ characters) |
| `FIREBASE_PROJECT_ID` | `spiritual-app-99c47` |
| `NODE_ENV` | `production` |

Do **not** commit these values in code; only set them in Vercel.

---

## 4. Deploy

1. Click **Deploy**.
2. Wait for the build to finish (a few minutes).
3. Open the URL Vercel gives you (e.g. `https://spiritual-katha-xxx.vercel.app`).

---

## 5. After first deploy

1. **MongoDB Atlas:** In [cloud.mongodb.com](https://cloud.mongodb.com) → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel can connect. If the cluster is **Paused**, click **Resume**.
2. **Firebase:** In [Firebase Console](https://console.firebase.google.com) → your project → **Authentication** → **Settings** → **Authorized domains** → add your Vercel domain (e.g. `spiritual-katha-xxx.vercel.app`).
3. **First Guru:** Open your live site → **Register** → choose role **Guru** → create account (or use the seed script with the same `MONGODB_URI` if you run it locally once).

---

## 6. If something fails

- **Build failed:** Check the build log; ensure **Build Command** is exactly `npm run build` and root **package.json** has the `build` script.
- **“Database not connected”:** Check `MONGODB_URI` and Atlas **Network Access** (and that the cluster is not paused).
- **Google Sign-in not working:** Add your Vercel domain to Firebase **Authorized domains**.
- **404 on refresh:** Vercel’s single route to `app.js` should serve the SPA; if you still get 404, confirm `vercel.json` and `app.js` are in the repo root and redeploy.
