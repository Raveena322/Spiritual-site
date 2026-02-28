# Spiritual Katha Booking Website

A web application for booking spiritual katha sessions with a Guru. The system allows Gurus to manage their availability and devotees to book katha sessions.

## 📋 Table of Contents

- [System Design](#system-design)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Booking & Approval Flow](#booking--approval-flow)

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
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## 📁 Project Structure

```
spiritual-site/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User model (Guru/Devotee)
│   │   ├── AvailableSlot.js     # Available slot model
│   │   └── Booking.js            # Booking model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── slots.js              # Available slots routes
│   │   └── bookings.js           # Booking routes
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── roleCheck.js          # Role-based access control
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── slotController.js     # Slot management
│   │   └── bookingController.js  # Booking management
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   └── SlotCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Guru login
│   │   │   ├── Dashboard.jsx     # Guru dashboard
│   │   │   ├── Bookings.jsx      # Devotee bookings
│   │   │   └── AvailableSlots.jsx # View available slots
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── services/
│   │   │   └── api.js            # API service
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
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
Then open **http://localhost:3000**. Sign in with email/password or **Sign in with Google** (backend must be running for Google sign-in).

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
```

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
After first run, you can create a Guru account through the registration endpoint or seed script.

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['guru', 'devotee'], default: 'devotee'),
  createdAt: Date
}
```

### AvailableSlot Model
```javascript
{
  guruId: ObjectId (ref: User, required),
  fromDate: Date (required),
  toDate: Date (required),
  location: String (enum: ['North side', 'Mountain'], required),
  availableGranths: [String] (enum: ['Ramayan', 'Bhagwat', 'Mahabharat', 'Other'], required),
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
  location: String (required),
  status: String (enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'),
  message: String (optional),
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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Available Slots (Guru only)
- `POST /api/slots` - Create new slot
- `GET /api/slots` - Get all slots (public)
- `GET /api/slots/my-slots` - Get guru's slots (protected)
- `PUT /api/slots/:id` - Update slot (protected)
- `DELETE /api/slots/:id` - Delete slot (protected)

### Bookings
- `POST /api/bookings` - Create booking (devotee)
- `GET /api/bookings` - Get user's bookings (protected)
- `GET /api/bookings/pending` - Get pending bookings (guru only)
- `PUT /api/bookings/:id/approve` - Approve booking (guru only)
- `PUT /api/bookings/:id/reject` - Reject booking (guru only)

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (Guru vs Devotee)
- Protected routes on both frontend and backend

## 📄 License

This project is open source and available for personal use.

