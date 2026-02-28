# 🔧 Troubleshooting Registration Issues

## Common Issues and Solutions

### Issue: "Registration failed. Please try again."

This error can occur for several reasons. Follow these steps:

---

## ✅ Step 1: Check Backend Server

**Make sure your backend server is running:**

1. Open a terminal
2. Navigate to backend folder:
   ```powershell
   cd "C:\Users\khich\OneDrive\Documents\SPIRITUAL SITE\backend"
   ```
3. Start the server:
   ```powershell
   npm start
   ```

**Expected output:**
```
MongoDB Connected: localhost:27017
Server running in development mode on port 5000
```

**If you see errors:**
- MongoDB connection error → Check if MongoDB is running
- Port 5000 already in use → Change PORT in `.env` file

---

## ✅ Step 2: Check MongoDB Connection

**Make sure MongoDB is running:**

1. **Check if MongoDB service is running:**
   - Windows: Open Services (Win+R → `services.msc`)
   - Look for "MongoDB" service
   - If not running, start it

2. **Or start MongoDB manually:**
   ```powershell
   mongod
   ```

3. **Verify MongoDB connection:**
   - Check backend terminal for: `MongoDB Connected: localhost:27017`
   - If you see connection errors, MongoDB is not running

---

## ✅ Step 3: Check Backend .env File

**Verify your `backend/.env` file exists and has correct values:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key-change-this-in-production-12345
NODE_ENV=development
```

**If `.env` doesn't exist:**
1. Create it in the `backend` folder
2. Copy the content above
3. Restart the backend server

---

## ✅ Step 4: Test API Connection

**Test if backend is accessible:**

1. Open browser
2. Go to: `http://localhost:5000/api/health`
3. You should see: `{"success":true,"message":"Server is running"}`

**If you get an error:**
- Backend is not running → Go to Step 1
- Connection refused → Check if port 5000 is available

---

## ✅ Step 5: Check Browser Console

**Open browser developer tools (F12) and check for errors:**

1. Go to Console tab
2. Try to register again
3. Look for error messages

**Common console errors:**
- `Network Error` → Backend not running
- `CORS error` → Backend CORS not configured (should be fixed)
- `404 Not Found` → API endpoint wrong

---

## ✅ Step 6: Verify Registration Data

**Make sure you're entering valid data:**

- **Name:** Required, any text
- **Email:** Required, valid email format (e.g., `user@example.com`)
- **Password:** Required, at least 6 characters
- **Confirm Password:** Must match password
- **Account Type:** Select either "Devotee" or "Guru"

---

## ✅ Step 7: Check for Duplicate Email

**If email already exists:**

- Try a different email address
- Or login with existing account instead

---

## 🔍 Quick Diagnostic Commands

**Test backend connection:**
```powershell
# In browser or using curl
curl http://localhost:5000/api/health
```

**Check if MongoDB is running:**
```powershell
# Try to connect to MongoDB
mongo
# If it connects, MongoDB is running
```

**Check backend logs:**
- Look at the terminal where backend is running
- Check for any error messages when you try to register

---

## 🆘 Still Not Working?

1. **Check backend terminal** for error messages
2. **Check browser console** (F12) for frontend errors
3. **Verify both servers are running:**
   - Backend on port 5000
   - Frontend on port 3000
4. **Try restarting both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend again
   - Start frontend again

---

## 📝 Expected Registration Flow

1. User fills registration form
2. Frontend sends POST request to `http://localhost:5000/api/auth/register`
3. Backend validates data
4. Backend creates user in MongoDB
5. Backend returns JWT token
6. Frontend stores token and redirects user

If any step fails, check the error message for details.


