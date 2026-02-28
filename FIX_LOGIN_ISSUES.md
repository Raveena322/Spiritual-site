# Quick Fix for Login and Slots Issues

## Step-by-Step Solution

### Step 1: Make sure backend .env file exists

The `.env` file has been created in the `backend` folder. If it doesn't exist, create it with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key-change-this-in-production-12345
NODE_ENV=development
```

### Step 2: Start MongoDB

**If using local MongoDB:**
- Make sure MongoDB service is running
- Or start it manually: `mongod`

**If using MongoDB Atlas:**
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### Step 3: Start Backend Server

Open a **new terminal** and run:
```bash
cd "C:\Users\khich\OneDrive\Documents\SPIRITUAL SITE\backend"
npm install
npm start
```

You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

### Step 4: Create Guru Account

**Option A: Using Seed Script (Easiest)**

In the backend terminal (or a new terminal):
```bash
cd "C:\Users\khich\OneDrive\Documents\SPIRITUAL SITE\backend"
npm run seed:guru
```

This creates:
- **Email:** `guru@example.com`
- **Password:** `password123`

**Option B: Using Browser Console**

1. Open your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Run this code:

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
.then(data => {
  console.log('Success:', data);
  if (data.success) {
    alert('Guru account created! Email: guru@example.com, Password: password123');
  } else {
    alert('Error: ' + data.message);
  }
})
.catch(err => {
  console.error('Error:', err);
  alert('Failed to create account. Make sure backend is running!');
});
```

### Step 5: Login as Guru

1. Go to http://localhost:3000
2. Click "Guru Login"
3. Enter:
   - **Email:** `guru@example.com`
   - **Password:** `password123`
4. Click "Login to Dashboard"

### Step 6: Create Time Slots

After logging in:
1. You'll be on the Dashboard
2. Click the **"My Slots"** tab
3. Click **"+ Add New Slot"** button
4. Fill in:
   - **From Date:** Select a future date (e.g., tomorrow)
   - **To Date:** Select a date after from date
   - **Location:** Choose "North side" or "Mountain"
   - **Available Granths:** Check at least one (Ramayan, Bhagwat, Mahabharat, Other)
5. Click **"Create Slot"**

### Step 7: View Slots on Homepage

1. Logout from guru account
2. Go to homepage (http://localhost:3000)
3. You should now see the slot you created!

## Troubleshooting

### If login still fails:

1. **Check backend is running:**
   - Open http://localhost:5000/api/health in browser
   - Should show: `{"success": true, "message": "Server is running"}`

2. **Check MongoDB connection:**
   - Look at backend terminal for connection errors
   - Make sure MongoDB is running

3. **Check browser console:**
   - Press F12 → Console tab
   - Look for any error messages

4. **Try creating account again:**
   - The seed script might show "already exists" - that's okay, you can use those credentials

### If no slots show:

1. **Make sure you created slots:**
   - Login as guru
   - Go to "My Slots" tab
   - You should see your created slots there

2. **Check slots API:**
   - Open http://localhost:5000/api/slots in browser
   - Should show slots in JSON format

3. **Check browser console:**
   - Look for API errors in Network tab

## Quick Test Commands

**Test Backend:**
```bash
curl http://localhost:5000/api/health
```

**Test Slots API:**
```bash
curl http://localhost:5000/api/slots
```

**Create Guru (using curl):**
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Swami Ji\",\"email\":\"guru@example.com\",\"password\":\"password123\",\"role\":\"guru\"}"
```

## Summary

The main issues are usually:
1. ✅ Backend not running → Start it with `npm start` in backend folder
2. ✅ No guru account → Create one using seed script or API
3. ✅ No slots created → Login as guru and create slots in dashboard

Follow the steps above and everything should work! 🎉

