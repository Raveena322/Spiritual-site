# Quick Start Guide - Spiritual Katha Booking Website

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (local or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Clone/Download Project

If you have the project files, navigate to the project directory:
```bash
cd "SPIRITUAL SITE"
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
Create a `.env` file in the `backend` directory:
```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Or manually create .env file with:
```

Add the following content to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key-change-this-in-production-12345
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spiritual-katha
```

### 2.3 Start MongoDB
**Local MongoDB:**
```bash
# Windows
# Make sure MongoDB service is running
# Or start manually:
mongod
```

**MongoDB Atlas:**
- No local setup needed, just use the connection string

### 2.4 Start Backend Server
```bash
npm start
```

You should see:
```
MongoDB Connected: localhost:27017
Server running in development mode on port 5000
```

✅ Backend is running on `http://localhost:5000`

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies
Open a **new terminal** window:
```bash
cd frontend
npm install
```

### 3.2 Configure Environment (Optional)
Create a `.env` file in the `frontend` directory (only if backend is not on localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.3 Start Frontend Development Server
```bash
npm start
```

The browser should automatically open to `http://localhost:3000`

✅ Frontend is running on `http://localhost:3000`

---

## Step 4: Create Your First Guru Account

### Option A: Using API (Recommended for Testing)

**Using curl or Postman:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Swami Ji",
  "email": "guru@example.com",
  "password": "password123",
  "role": "guru"
}
```

### Option B: Using Browser Console
1. Open browser console (F12)
2. Go to `http://localhost:3000`
3. Run:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Swami Ji',
    email: 'guru@example.com',
    password: 'password123',
    role: 'guru'
  })
}).then(r => r.json()).then(console.log)
```

---

## Step 5: Test the Application

### 5.1 Login as Guru
1. Go to `http://localhost:3000`
2. Click "Guru Login"
3. Enter credentials:
   - Email: `guru@example.com`
   - Password: `password123`
4. You'll be redirected to Dashboard

### 5.2 Create an Available Slot
1. In Dashboard, click "My Slots" tab
2. Click "+ Add New Slot"
3. Fill the form:
   - From Date: Select a future date
   - To Date: Select a date after from date
   - Location: Choose "Mountain" or "North side"
   - Available Granths: Check at least one (Ramayan, Bhagwat, etc.)
4. Click "Create Slot"
5. Slot appears in "My Slots" and on homepage

### 5.3 Create Devotee Account & Book
1. Logout from Guru account
2. Register as Devotee (or use API):
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Devotee Name',
    email: 'devotee@example.com',
    password: 'password123',
    role: 'devotee'
  })
})
```
3. Login with devotee credentials
4. On homepage, click "Book This Slot" on any available slot
5. Fill booking form and submit
6. Go to "My Bookings" to see status (Pending)

### 5.4 Approve Booking as Guru
1. Logout and login as Guru
2. Go to Dashboard → "Pending Bookings" tab
3. See the booking request
4. Click "Approve" or "Reject"
5. Devotee can now see updated status

---

## 🎯 Common Commands

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
```

### Frontend
```bash
cd frontend
npm start          # Start dev server
npm run build      # Build for production
```

### MongoDB (Local)
```bash
mongod             # Start MongoDB
mongo              # Open MongoDB shell
```

---

## 🔧 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in backend/.env to another port (e.g., 5001)
PORT=5001
```

**MongoDB connection error:**
- Check if MongoDB is running
- Verify MONGODB_URI in `.env`
- For Atlas: Check network access and credentials

**Module not found:**
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend Issues

**Port 3000 already in use:**
- React will automatically ask to use another port
- Or set: `PORT=3001 npm start`

**API connection error:**
- Check if backend is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

**Module not found:**
```bash
cd frontend
rm -rf node_modules
npm install
```

---

## 📝 Next Steps

1. **Read Documentation:**
   - `README.md` - Overview and project structure
   - `SYSTEM_DESIGN.md` - Architecture details
   - `DATABASE_SCHEMA.md` - Database structure
   - `BOOKING_FLOW.md` - Complete user flow

2. **Customize:**
   - Update colors in `frontend/tailwind.config.js`
   - Modify API endpoints if needed
   - Add more granth options

3. **Deploy:**
   - Backend: Deploy to Heroku, Railway, or AWS
   - Frontend: Deploy to Vercel, Netlify, or AWS
   - Database: Use MongoDB Atlas for production

---

## 🎉 You're All Set!

The application is now running. Start creating slots and bookings!

For questions or issues, refer to the documentation files or check the code comments.

