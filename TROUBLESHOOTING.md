# Troubleshooting Guide

## Common Issues and Solutions

### 1. Login Failed Error

**Problem:** When trying to login as guru, you get "Login failed" error.

**Solutions:**

#### A. Check if Backend is Running
```bash
# In backend directory
cd backend
npm start
```

You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

#### B. Create a Guru Account

**Option 1: Using Seed Script (Recommended)**
```bash
cd backend
npm run seed:guru
```

This will create a default guru account:
- Email: `guru@example.com`
- Password: `password123`

**Option 2: Using API (Postman or Browser Console)**

Open browser console (F12) and run:
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
})
.then(r => r.json())
.then(console.log)
```

**Option 3: Using curl (Terminal)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Swami Ji","email":"guru@example.com","password":"password123","role":"guru"}'
```

#### C. Check MongoDB Connection

Make sure MongoDB is running:
- **Local MongoDB:** Check if MongoDB service is running
- **MongoDB Atlas:** Verify connection string in `.env` file

Check your `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key
PORT=5000
```

#### D. Check CORS and API URL

Make sure frontend is pointing to correct backend URL.

Check `frontend/src/services/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2. No Time Slots Shown

**Problem:** Homepage shows "No available slots found"

**Solutions:**

#### A. Create Slots as Guru

1. Login as guru (using credentials from step 1)
2. Go to Dashboard
3. Click "My Slots" tab
4. Click "+ Add New Slot"
5. Fill in the form:
   - From Date: Select a future date
   - To Date: Select a date after from date
   - Location: Choose "North side" or "Mountain"
   - Available Granths: Check at least one (Ramayan, Bhagwat, etc.)
6. Click "Create Slot"

#### B. Check Backend API

Test if slots API is working:
```bash
# In browser console or Postman
fetch('http://localhost:5000/api/slots')
  .then(r => r.json())
  .then(console.log)
```

Should return:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

#### C. Check Database

If you have MongoDB shell access:
```javascript
use spiritual-katha
db.availableslots.find()
```

### 3. Backend Not Starting

**Problem:** Backend server won't start

**Solutions:**

#### A. Check Dependencies
```bash
cd backend
npm install
```

#### B. Check MongoDB Connection
- Make sure MongoDB is installed and running
- Check `.env` file has correct `MONGODB_URI`

#### C. Check Port Availability
```bash
# Windows
netstat -ano | findstr :5000

# If port is in use, change PORT in .env file
```

### 4. Frontend Can't Connect to Backend

**Problem:** Frontend shows network errors

**Solutions:**

#### A. Check Backend is Running
```bash
# Test backend health
curl http://localhost:5000/api/health
```

Should return:
```json
{"success": true, "message": "Server is running"}
```

#### B. Check CORS
Backend should have CORS enabled (already configured in `server.js`)

#### C. Check API URL
Make sure frontend `.env` or `api.js` has correct URL:
```javascript
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Password Not Working

**Problem:** Can't login even with correct password

**Solutions:**

#### A. Recreate User Account
Delete old account and create new one:
```bash
# Using MongoDB shell
use spiritual-katha
db.users.deleteOne({ email: "guru@example.com" })
```

Then create new account using seed script or API.

#### B. Check Password Hashing
The password is automatically hashed when user is created. Make sure you're using the plain password (not hashed) when logging in.

### Quick Fix Checklist

1. ✅ Backend server running on port 5000
2. ✅ MongoDB connected and running
3. ✅ Guru account exists (use seed script)
4. ✅ Frontend can reach backend (check network tab)
5. ✅ Slots created in database (login as guru and create slots)

### Testing Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Create Guru Account:**
   ```bash
   cd backend
   npm run seed:guru
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Login:**
   - Go to http://localhost:3000
   - Click "Guru Login"
   - Email: `guru@example.com`
   - Password: `password123`

5. **Create Slot:**
   - Go to Dashboard
   - Click "My Slots" tab
   - Click "+ Add New Slot"
   - Fill form and submit

6. **View Slots:**
   - Logout
   - Go to homepage
   - You should see the slot you created

### Still Having Issues?

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify MongoDB connection
4. Check network tab in browser DevTools
5. Make sure all environment variables are set correctly

