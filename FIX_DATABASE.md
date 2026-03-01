# Fix "Database not connected" error

If you see **Database not connected** when logging in, the app cannot reach MongoDB. Use one of these options.

---

## Option 1: Use local MongoDB (easiest if you can install it)

1. **Install MongoDB Community** (one-time):
   - Windows: https://www.mongodb.com/try/download/community — run the installer.
   - Or with Chocolatey: `choco install mongodb`
   - Make sure the MongoDB service is running (Services → MongoDB, or run `mongod`).

2. **Point the app to local MongoDB:**
   - Open `backend/.env`
   - Set this line (comment or replace the Atlas line):
     ```env
     MONGODB_URI=mongodb://localhost:27017/spiritual-katha
     ```

3. **Restart the backend** (stop and run `npm start` again from the project root).

Login and the app will use your local database.

---

## Option 2: Fix MongoDB Atlas (keep using the cloud)

If you want to keep using Atlas (your current `MONGODB_URI` with `mongodb.net`):

1. Go to **https://cloud.mongodb.com** and sign in.

2. **Network Access (allow your IP):**
   - Left sidebar → **Network Access** → **Add IP Address**.
   - Click **Add Current IP Address** (or for testing only you can use **Allow Access from Anywhere** — `0.0.0.0/0`).
   - Confirm.

3. **Resume cluster if it’s paused:**
   - Left sidebar → **Database** → your cluster (e.g. **Cluster0**).
   - If you see **Resume**, click it and wait until the cluster is active.

4. **Restart the backend** (stop and run `npm start` again).

---

## Automatic fallback

If Atlas fails to connect (e.g. wrong IP or cluster paused), the backend will **automatically try local MongoDB** (`mongodb://localhost:27017/spiritual-katha`). If MongoDB is installed and running on your machine, the app will connect there and the error will go away after you restart the backend.
