# Spiritual Katha Booking Website

A web application for booking spiritual katha sessions with a Guru. The system allows Gurus (Swami ji) to manage their availability and devotees to book katha sessions.

## 📋 Table of Contents

- [Features](#-features)
- [System Design](#-system-design)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Booking & Approval Flow](#-booking--approval-flow)
- [API Endpoints](#-api-endpoints)
- [Security & Troubleshooting](#-security--troubleshooting)

## ✨ Features

### Authentication & Accounts
- **Email/password** – Register and sign in as Guru or Devotee
- **Google Sign-in** – Sign in with Google (account picker for choosing email)
- **Default Guru** – Seed script creates `guru@example.com` / `password123` for quick testing

### 📅 Calendar & Booking
- **Calendar view** – Toggle between List and Calendar on the home page; see availability by month
- **Highlight booked dates** – On the booking form, a calendar shows which dates in a slot are already booked (approved)
- **Disable unavailable dates** – Calendar grays out dates outside slot ranges; pick only valid dates
- **Booking confirmation page** – After booking, redirect to a confirmation screen with **Booking ID**, details, and **Print / Save as PDF**
- **Devotee message options** – **Purpose of katha** and **Special requests** (and optional message) when creating a booking

### 📍 Location System
- **Full address** – Optional full address field for slots and bookings
- **City + State** – State and district (with Indian states/districts data); optional city
- **Google Maps link** – Optional Maps URL per slot; “Open in Google Maps” on slot cards and confirmation

### 🔔 Email Notifications (optional)
- **Booking received** – Guru gets an email when a devotee submits a booking
- **Approved / Rejected** – Devotee gets an email when Guru approves or rejects
- **Reminder** – Devotee gets a reminder email the day before the katha date  
- Configure SMTP in `backend/.env` (see `backend/.env.example`); if not set, emails are logged to console only

### 👨‍🏫 Guru (Swami ji) Dashboard
- **Stats cards** – Total bookings, Pending requests, Upcoming kathas, Past completed
- **Delete available slot** – Remove a slot if there is any inconvenience (“Remove slot” button on each slot card)
- **Pending bookings** – Approve or reject with one click
- **My Slots** – Create slots with date range, state, district, city, full address, maps link, and granths

### 📱 Mobile & UX
- **Mobile-friendly** – Large touch targets (min 44px), scrollable forms, responsive layout
- **Home** – Hero with CTAs, How It Works, **Bhagavad Gita shlokas** (rotating), and **YouTube – SatsangSevaSumiran** link
- **Navbar** – Home, Login, Register, Dashboard (Guru), My Bookings, Logout
- **Print-friendly** – Confirmation page hides nav/footer when printing (Save as PDF)

## 🏗️ System Design

### Overview
The application consists of two main user roles:

1. **Guru (Admin)**
   - Manages available dates and locations
   - Specifies available granths (Ramayan, Bhagwat, Mahabharat, etc.)
   - Reviews and approves/rejects booking requests

2. **Devotee (User)**
   - Views available katha slots
   - Books katha sessions by selecting:
     - Granth (Ramayan, Bhagwat, Mahabharat, etc.)
     - Date range (From date - To date)
     - Location (North side / Mountain)
   - Tracks booking status (Pending, Approved, Rejected)

### Architecture
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │ ──────> │   Express   │ ──────> │   MongoDB   │
│  Frontend   │ <────── │   Backend   │ <────── │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React.js** – UI framework
- **Tailwind CSS** – Styling
- **Axios** – HTTP client for API calls
- **React Router** – Navigation
- **Firebase** – Google Sign-in (client SDK)

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – Database (local or Atlas)
- **Mongoose** – ODM for MongoDB
- **JWT (jsonwebtoken)** – Authentication
- **bcryptjs** – Password hashing
- **Firebase Admin** – Verify Google ID tokens
- **Nodemailer** – Optional email notifications
- **dotenv** – Environment variables

## 📁 Project Structure

```
spiritual-site/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection (with local fallback)
│   ├── models/
│   │   ├── User.js               # User (Guru/Devotee, local + Google)
│   │   ├── AvailableSlot.js      # Slot with location, mapsLink, granths
│   │   └── Booking.js            # Booking with purpose, specialRequests
│   ├── routes/
│   │   ├── auth.js
│   │   ├── slots.js
│   │   └── bookings.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── slotController.js
│   │   └── bookingController.js
│   ├── utils/
│   │   └── emailService.js       # Email notifications (SMTP)
│   ├── scripts/
│   │   └── seedGuru.js           # Create default guru@example.com
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   ├── SlotCard.jsx
│   │   │   ├── AvailabilityCalendar.jsx  # Calendar view
│   │   │   ├── GitaShlokas.jsx            # Bhagavad Gita shlokas
│   │   │   └── DailyQuote.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx     # Guru: stats, slots, delete, bookings
│   │   │   ├── Bookings.jsx
│   │   │   ├── AvailableSlots.jsx
│   │   │   └── BookingConfirmation.jsx   # After booking + PDF
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   ├── gitaShlokas.js
│   │   │   └── indianLocations.js
│   │   ├── firebase.js            # Google Sign-in config
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── FIX_DATABASE.md               # Fix "Database not connected"
├── package.json                  # Root: npm start (backend + frontend)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Quick start (run backend + frontend together)
From the project root (`Spiritual-site-master`):
```bash
npm install    # installs concurrently (one-time)
npm start      # starts backend on :5000 and frontend on :3000
```
Then open **http://localhost:3000**. Sign in with email/password or **Sign in with Google**.

**Default Guru (for testing):** Run once to create a Guru account:
```bash
cd backend && node scripts/seedGuru.js
```
Then log in with **Email:** `guru@example.com` **Password:** `password123`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
```
For email notifications, add SMTP vars (see `backend/.env.example`). If you see "Database not connected", see **FIX_DATABASE.md**.

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Default Guru Account
Run `node scripts/seedGuru.js` from the `backend` folder to create:
- **Email:** guru@example.com  
- **Password:** password123  
- **Role:** guru  

Or register a new account from the app’s Register page.

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (optional for Google users, hashed),
  role: String (enum: ['guru', 'devotee'], default: 'devotee'),
  provider: String (enum: ['local', 'google'], default: 'local'),
  createdAt: Date
}
```

### AvailableSlot Model
```javascript
{
  guruId: ObjectId (ref: User, required),
  fromDate: Date (required),
  toDate: Date (required),
  state: String (required),
  district: String (required),
  city: String (optional),
  fullAddress: String (optional),
  mapsLink: String (optional),
  location: String (optional, backward compat),
  availableGranths: [String] (required),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

### Booking Model
```javascript
{
  devoteeId: ObjectId (ref: User, required),
  slotId: ObjectId (ref: AvailableSlot, required),
  selectedGranth: String (required),
  fromDate: Date (required),
  toDate: Date (required),
  state: String (required),
  district: String (required),
  fullAddress: String (optional),
  city: String (optional),
  mapsLink: String (optional),
  purposeOfKatha: String (optional),
  specialRequests: String (optional),
  message: String (optional),
  status: String (enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Booking & Approval Flow

### Flow Diagram
```
1. Guru Login
   ↓
2. Guru Adds Available Slot
   (Date range, Location, Granths)
   ↓
3. Devotee Views Available Slots
   ↓
4. Devotee Selects Slot & Creates Booking
   (Granth, Date range, Location)
   ↓
5. Booking Status: Pending
   ↓
6. Guru Reviews Booking Request
   ↓
7. Guru Approves/Rejects
   ↓
8. Devotee Sees Updated Status
```

### Detailed Steps

1. **Guru Registration/Login**
   - Guru registers with email and password
   - JWT token is generated upon login
   - Token stored in localStorage (frontend)

2. **Guru Adds Available Slot**
   - Guru logs into dashboard
   - Fills form: From Date, To Date, Location, Available Granths
   - Slot is saved to database

3. **Devotee Views Slots**
   - Devotee visits homepage
   - Sees list of all active available slots
   - Can filter by location or granth

4. **Devotee Creates Booking**
   - Selects a slot
   - Chooses granth from available options
   - Confirms date range and location
   - Submits booking request
   - Booking created with status "Pending"

5. **Guru Reviews Booking**
   - Guru sees all pending bookings in dashboard
   - Can view booking details
   - Approves or rejects the request

6. **Status Update**
   - Booking status updated in database
   - Devotee can see updated status in their bookings page

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login with email/password
- `POST /api/auth/google` – Login with Google ID token
- `GET /api/auth/me` – Get current user (protected)

### Available Slots
- `GET /api/slots` – Get all active slots (public)
- `GET /api/slots/:id/booked-dates` – Get approved booking date ranges for a slot (public, for calendar)
- `POST /api/slots` – Create slot (Guru only)
- `GET /api/slots/my-slots` – Get guru's slots (Guru only)
- `PUT /api/slots/:id` – Update slot (Guru only)
- `DELETE /api/slots/:id` – Delete slot (Guru only)

### Bookings
- `POST /api/bookings` – Create booking (Devotee)
- `GET /api/bookings` – Get current user's bookings (protected)
- `GET /api/bookings/:id` – Get single booking by ID (owner or Guru)
- `GET /api/bookings/stats` – Guru dashboard stats: total, pending, upcoming, past (Guru only)
- `GET /api/bookings/pending` – Get pending bookings (Guru only)
- `PUT /api/bookings/:id/approve` – Approve booking (Guru only)
- `PUT /api/bookings/:id/reject` – Reject booking (Guru only)

### Other
- `GET /api/health` – Health check

## 🔒 Security & Troubleshooting

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (Guru vs Devotee)
- Protected routes on frontend and backend
- Firebase Admin verifies Google ID tokens on the backend

**Database not connected:** See **FIX_DATABASE.md**. Use local MongoDB (`MONGODB_URI=mongodb://localhost:27017/spiritual-katha`) or fix Atlas Network Access and resume cluster.

**Invalid email or password:** For a fresh local DB, run `cd backend && node scripts/seedGuru.js` to create `guru@example.com` / `password123`.

## 📄 License

This project is open source and available for personal use.

