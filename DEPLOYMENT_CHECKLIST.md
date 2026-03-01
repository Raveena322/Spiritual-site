# Deployment checklist – Spiritual Katha

Use this to confirm all features are in place and what to set before going live.

---

## Feature verification (all implemented)

| Feature | Status | Where |
|--------|--------|--------|
| **Auth: email/password** | Done | Login, Register, authController |
| **Auth: Google Sign-in** | Done | firebase.js, AuthContext, Login/Register, POST /api/auth/google |
| **Default Guru seed** | Done | backend/scripts/seedGuru.js (guru@example.com / password123) |
| **Calendar view on Home** | Done | Home.jsx – List/Calendar toggle, AvailabilityCalendar, date filter |
| **Booked dates on booking form** | Done | AvailableSlots – getBookedDates, AvailabilityCalendar with bookedRanges |
| **Location: full address, city, maps link** | Done | AvailableSlot & Booking models, Dashboard slot form, SlotCard, BookingCard, BookingConfirmation |
| **Purpose of katha + special requests** | Done | Booking model, AvailableSlots form, BookingCard |
| **Email: booking received** | Done | emailService.sendBookingReceivedToGuru, bookingController create |
| **Email: approved/rejected** | Done | emailService.sendBookingStatusToDevotee, approve/reject |
| **Email: reminder before katha** | Done | server.js runReminderJob (daily), emailService.sendReminderToDevotee |
| **Booking confirmation page** | Done | BookingConfirmation.jsx, route /bookings/confirmation/:id, redirect after create |
| **Booking ID + Print/PDF** | Done | BookingConfirmation – ID display, window.print(), no-print on nav/footer |
| **Guru dashboard stats** | Done | getStats API, Dashboard stats cards (total, pending, upcoming, past) |
| **Delete available slot** | Done | handleDeleteSlot, slotsAPI.delete, “Remove slot” button on slot cards |
| **Gita shlokas on Home** | Done | GitaShlokas.jsx, gitaShlokas.js, Home.jsx |
| **YouTube – SatsangSevaSumiran** | Done | Home hero + Footer link |
| **Mobile-friendly UI** | Done | min-h-[48px], touch-manipulation, responsive layout on key pages |
| **Database: local fallback** | Done | db.js tries local MongoDB if Atlas fails; FIX_DATABASE.md |
| **Backend starts without DB** | Done | server.js – app.listen() before connectDB() |

---

## Pre-deploy steps

### Backend (Node host: Render, Railway, Heroku, etc.)

- [ ] Set **MONGODB_URI** to production DB (Atlas or other). Add server IP to Atlas Network Access if using Atlas.
- [ ] Set **JWT_SECRET** to a long, random secret (not the example one).
- [ ] Set **FIREBASE_PROJECT_ID** to your Firebase project ID (for Google Sign-in).
- [ ] Optional: set **SMTP_*** for real emails (see backend/.env.example).
- [ ] Ensure **PORT** is set or host uses default (e.g. 5000 or `process.env.PORT`).
- [ ] Do **not** commit `.env`; set env vars in the host’s dashboard.

### Frontend (Vercel, Netlify, static host, etc.)

- [ ] Set **REACT_APP_API_URL** to your backend API base URL, e.g. `https://your-api.com/api` (no trailing slash).
- [ ] Run **npm run build** in `frontend/` and deploy the `build` folder (or use host’s build command).
- [ ] Confirm Firebase auth domain allows your frontend domain (Firebase Console → Authentication → Settings).

### After first deploy

- [ ] Create at least one Guru (register or run seed against production DB if you have a way to run scripts).
- [ ] Test: register, login, Google login, create slot, book, confirm, approval, confirmation page, print.

---

## Quick reference

- **Local run:** `npm start` from project root (backend :5000, frontend :3000).
- **Default guru (local):** `cd backend && node scripts/seedGuru.js` → guru@example.com / password123.
- **Database issues:** See **FIX_DATABASE.md**.
