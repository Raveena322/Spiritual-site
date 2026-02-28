# 🌐 How to View Your Spiritual Katha Booking Website

## Quick Start (3 Steps)

### Step 1: Start Backend Server

Open **Terminal 1** (PowerShell or Command Prompt):

```powershell
cd backend
npm start
```

**Expected Output:**
```
MongoDB Connected: localhost:27017
Server running in development mode on port 5000
```

✅ Backend is now running on `http://localhost:5000`

---

### Step 2: Start Frontend Server

Open **Terminal 2** (NEW terminal window):

```powershell
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view spiritual-katha-frontend in the browser.
  Local:            http://localhost:3000
```

✅ Frontend is now running on `http://localhost:3000`

**The browser should automatically open!** If not, manually go to:
👉 **http://localhost:3000**

---

### Step 3: View Your Site

1. **Open your browser** (Chrome, Firefox, Edge, etc.)
2. **Go to:** `http://localhost:3000`
3. You should see the **Homepage** with:
   - Daily Spiritual Quotes
   - Available Slots (if any exist)
   - Navigation menu

---

## 📋 Prerequisites Checklist

Before starting, make sure:

- ✅ **Node.js is installed** - Check: `node --version`
- ✅ **MongoDB is running** - Check: MongoDB service should be running
- ✅ **Dependencies installed:**
  ```powershell
  cd backend
  npm install
  
  cd ../frontend
  npm install
  ```

---

## 🎯 What You'll See

### Homepage (`http://localhost:3000`)
- Beautiful gradient background
- Daily spiritual quotes (auto-changing)
- Available katha slots
- Filter by state/district/granth
- "Book This Slot" buttons

### Guru Login (`http://localhost:3000/login`)
- Login form for Guru
- After login → Dashboard

### Guru Dashboard
- **Pending Bookings** tab - Approve/Reject requests
- **My Slots** tab - Create and manage available slots
- **Granth Selection** - All 21 granths available!

### Devotee Features
- View available slots
- Book katha sessions
- Track booking status (Pending/Approved/Rejected)

---

## 🔧 Troubleshooting

### Backend won't start?
1. Check if MongoDB is running
2. Check if port 5000 is available
3. Verify `.env` file exists in `backend/` folder

### Frontend won't start?
1. Check if port 3000 is available
2. React will ask to use another port if 3000 is busy
3. Make sure you're in the `frontend/` directory

### Can't see slots?
1. Login as Guru first
2. Create a slot in Dashboard → "My Slots" tab
3. Then view on homepage

### Can't login?
1. Create a Guru account first using the seed script:
   ```powershell
   cd backend
   npm run seed:guru
   ```
2. Login with:
   - Email: `guru@example.com`
   - Password: `password123`

---

## 🚀 Quick Commands Reference

### Start Backend
```powershell
cd backend
npm start
```

### Start Frontend
```powershell
cd frontend
npm start
```

### Create Guru Account
```powershell
cd backend
npm run seed:guru
```

---

## 📱 Access URLs

- **Frontend (Website):** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

---

## ✨ Enjoy Your Site!

Once both servers are running, your beautiful Spiritual Katha Booking Website is live! 🎉


