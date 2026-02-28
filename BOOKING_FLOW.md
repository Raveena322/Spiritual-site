# Booking & Approval Flow - Spiritual Katha Booking Website

## 🔄 Complete User Journey

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GURU WORKFLOW                                 │
└─────────────────────────────────────────────────────────────────┘

1. Guru Registration/Login
   │
   ├─→ POST /api/auth/register (or /login)
   │   └─→ JWT Token Generated
   │
   └─→ Redirect to Dashboard

2. Guru Creates Available Slot
   │
   ├─→ Dashboard → "Add New Slot" Button
   │
   ├─→ Fill Form:
   │   ├─ From Date
   │   ├─ To Date
   │   ├─ Location (North side / Mountain)
   │   └─ Available Granths (Ramayan, Bhagwat, Mahabharat, Other)
   │
   ├─→ POST /api/slots
   │   └─→ Slot Created in Database (isActive: true)
   │
   └─→ Slot Appears in "My Slots" Tab

3. Guru Reviews Booking Requests
   │
   ├─→ Dashboard → "Pending Bookings" Tab
   │
   ├─→ View Booking Details:
   │   ├─ Devotee Name & Email
   │   ├─ Selected Granth
   │   ├─ Date Range
   │   ├─ Location
   │   └─ Optional Message
   │
   ├─→ Decision:
   │   ├─ Approve → PUT /api/bookings/:id/approve
   │   │   └─→ Status: "Approved"
   │   │
   │   └─ Reject → PUT /api/bookings/:id/reject
   │       └─→ Status: "Rejected"
   │
   └─→ Booking Status Updated

┌─────────────────────────────────────────────────────────────────┐
│                  DEVOTEE WORKFLOW                                │
└─────────────────────────────────────────────────────────────────┘

1. Devotee Views Available Slots
   │
   ├─→ Homepage (/)
   │
   ├─→ GET /api/slots (Public endpoint)
   │   └─→ Returns all active slots
   │
   ├─→ Filter Options:
   │   ├─ By Location (North side / Mountain)
   │   └─ By Granth (Ramayan, Bhagwat, Mahabharat, Other)
   │
   └─→ View Slot Cards with:
       ├─ Guru Name
       ├─ Date Range
       ├─ Location
       └─ Available Granths

2. Devotee Selects Slot & Books
   │
   ├─→ Click "Book This Slot" Button
   │   └─→ Redirects to Booking Form (/book)
   │
   ├─→ Fill Booking Form:
   │   ├─ Select Granth (from available options)
   │   ├─ From Date (within slot range)
   │   ├─ To Date (within slot range, after from date)
   │   ├─ Location (North side / Mountain)
   │   └─ Optional Message
   │
   ├─→ POST /api/bookings
   │   ├─→ Backend Validations:
   │   │   ├─ Slot exists and is active
   │   │   ├─ Selected granth is in availableGranths
   │   │   ├─ Dates are within slot date range
   │   │   └─ Devotee is authenticated
   │   │
   │   └─→ Booking Created (status: "Pending")
   │
   └─→ Redirect to "My Bookings" Page

3. Devotee Tracks Booking Status
   │
   ├─→ My Bookings Page (/bookings)
   │
   ├─→ GET /api/bookings
   │   └─→ Returns all bookings for logged-in devotee
   │
   └─→ View Status:
       ├─ 🟡 Pending (Waiting for Guru approval)
       ├─ 🟢 Approved (Booking confirmed)
       └─ 🔴 Rejected (Booking declined)
```

## 📋 Detailed Step-by-Step Process

### Step 1: Guru Setup (One-Time)

1. **Guru Registration**
   - Guru visits the website
   - Clicks "Guru Login"
   - If new, registers with:
     - Name
     - Email
     - Password
     - Role: "guru"
   - Receives JWT token
   - Redirected to Dashboard

2. **Guru Login** (Subsequent visits)
   - Enters email and password
   - Receives JWT token
   - Redirected to Dashboard

### Step 2: Guru Creates Available Slot

1. **Access Dashboard**
   - Guru logs in
   - Sees Dashboard with two tabs:
     - Pending Bookings
     - My Slots

2. **Create New Slot**
   - Clicks "My Slots" tab
   - Clicks "+ Add New Slot" button
   - Fills form:
     ```
     From Date: 2024-02-01
     To Date: 2024-02-15
     Location: Mountain
     Available Granths: ☑ Ramayan
                        ☑ Bhagwat
                        ☑ Mahabharat
                        ☐ Other
     ```
   - Clicks "Create Slot"
   - Slot saved to database
   - Slot appears in "My Slots" list

3. **Slot Visibility**
   - Slot immediately becomes visible on homepage
   - Devotees can see and book this slot

### Step 3: Devotee Discovers & Books

1. **Browse Available Slots**
   - Devotee visits homepage (no login required to view)
   - Sees all active slots in a grid
   - Can filter by:
     - Location dropdown
     - Granth dropdown

2. **Select Slot**
   - Devotee finds suitable slot
   - Clicks "Book This Slot" button
   - If not logged in: Prompted to login/register
   - If logged in: Redirected to booking form

3. **Fill Booking Form**
   - Pre-filled with slot information
   - Devotee selects:
     ```
     Granth: Ramayan (from available options)
     From Date: 2024-02-05 (within slot range)
     To Date: 2024-02-10 (within slot range)
     Location: Mountain
     Message: "Looking forward to the session"
     ```
   - Clicks "Submit Booking Request"

4. **Booking Created**
   - Backend validates:
     - ✅ Slot exists and is active
     - ✅ Selected granth is available
     - ✅ Dates are within slot range
     - ✅ Devotee is authenticated
   - Booking saved with status: "Pending"
   - Devotee redirected to "My Bookings"

### Step 4: Guru Reviews & Approves/Rejects

1. **View Pending Bookings**
   - Guru logs into Dashboard
   - Sees "Pending Bookings" tab (default)
   - Number badge shows count of pending bookings
   - Each booking card shows:
     - Devotee name and email
     - Selected granth
     - Date range
     - Location
     - Optional message
     - Status badge: "Pending"

2. **Review Booking Details**
   - Guru reviews each booking
   - Can see all relevant information
   - Makes decision based on:
     - Availability
     - Slot capacity
     - Other factors

3. **Approve Booking**
   - Clicks "Approve" button on booking card
   - Backend validates:
     - ✅ User is Guru
     - ✅ Slot belongs to this Guru
   - Booking status updated to "Approved"
   - Booking removed from pending list
   - Devotee can see updated status

4. **Reject Booking**
   - Clicks "Reject" button on booking card
   - Backend validates:
     - ✅ User is Guru
     - ✅ Slot belongs to this Guru
   - Booking status updated to "Rejected"
   - Booking removed from pending list
   - Devotee can see updated status

### Step 5: Devotee Tracks Status

1. **View My Bookings**
   - Devotee navigates to "My Bookings" page
   - Sees all their bookings (past and present)
   - Each booking shows:
     - Status badge (color-coded)
     - Granth selected
     - Date range
     - Location
     - Guru information
     - Creation date

2. **Status Updates**
   - **Pending**: Yellow badge, waiting for approval
   - **Approved**: Green badge, booking confirmed
   - **Rejected**: Red badge, booking declined

## 🔍 Validation Rules

### Slot Creation Validation
- ✅ From Date must be before To Date
- ✅ Location must be "North side" or "Mountain"
- ✅ At least one granth must be selected
- ✅ Only Gurus can create slots

### Booking Creation Validation
- ✅ Slot must exist and be active
- ✅ Selected granth must be in slot's availableGranths
- ✅ From Date must be >= slot's fromDate
- ✅ To Date must be <= slot's toDate
- ✅ To Date must be > From Date
- ✅ Location must match slot's location options
- ✅ Only Devotees can create bookings

### Approval/Rejection Validation
- ✅ Only Guru can approve/reject
- ✅ Guru must own the slot associated with booking
- ✅ Booking must be in "Pending" status

## 🎯 State Transitions

### Booking Status Flow
```
[Created] → Pending → [Approved] ✅
                    ↘ [Rejected] ❌
```

**States:**
- **Pending**: Initial state, waiting for Guru decision
- **Approved**: Guru accepted the booking
- **Rejected**: Guru declined the booking

**Rules:**
- Status can only change from Pending → Approved/Rejected
- Once Approved or Rejected, status cannot be changed
- (Future: Could add "Cancelled" state by Devotee)

## 📊 Data Flow Example

### Example: Complete Booking Cycle

**Day 1: Guru Creates Slot**
```javascript
// Guru creates slot
POST /api/slots
{
  fromDate: "2024-02-01",
  toDate: "2024-02-15",
  location: "Mountain",
  availableGranths: ["Ramayan", "Bhagwat"]
}

// Response: Slot created
{
  _id: "slot123",
  guruId: "guru456",
  // ... other fields
}
```

**Day 2: Devotee Books**
```javascript
// Devotee creates booking
POST /api/bookings
{
  slotId: "slot123",
  selectedGranth: "Ramayan",
  fromDate: "2024-02-05",
  toDate: "2024-02-10",
  location: "Mountain",
  message: "Looking forward to it"
}

// Response: Booking created
{
  _id: "booking789",
  status: "Pending",
  // ... other fields
}
```

**Day 3: Guru Approves**
```javascript
// Guru approves booking
PUT /api/bookings/booking789/approve

// Response: Booking approved
{
  _id: "booking789",
  status: "Approved",
  // ... other fields
}
```

## 🔔 Notification Flow (Future Enhancement)

Currently, status updates are visible when users refresh their pages. Future enhancements could include:

1. **Email Notifications**
   - Devotee receives email when booking is approved/rejected
   - Guru receives email when new booking is created

2. **Real-time Updates**
   - WebSocket connection for live status updates
   - Push notifications

3. **SMS Notifications**
   - SMS alerts for important status changes

## 🎨 UI/UX Flow Highlights

1. **Color Coding**
   - 🟡 Yellow: Pending status
   - 🟢 Green: Approved status
   - 🔴 Red: Rejected status

2. **Navigation**
   - Clear navigation between pages
   - Breadcrumbs for better orientation
   - Status badges for quick recognition

3. **Feedback**
   - Success messages after actions
   - Error messages for validation failures
   - Loading states during API calls

