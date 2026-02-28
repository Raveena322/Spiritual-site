# Database Schema - Spiritual Katha Booking Website

## Overview
This document describes the MongoDB database schema for the Spiritual Katha Booking application.

## Collections

### 1. Users Collection

**Purpose**: Stores user information for both Gurus and Devotees.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  name: String,                     // User's full name (required)
  email: String,                     // Unique email address (required, lowercase)
  password: String,                  // Hashed password using bcrypt (required, min 6 chars)
  role: String,                      // User role: 'guru' or 'devotee' (default: 'devotee')
  createdAt: Date                    // Account creation timestamp
}
```

**Example Document**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Swami Ji",
  "email": "swamiji@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "role": "guru",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Indexes**:
- `email`: Unique index (ensures no duplicate emails)

**Validation Rules**:
- `name`: Required, trimmed
- `email`: Required, unique, lowercase, trimmed
- `password`: Required, minimum 6 characters, automatically hashed before save
- `role`: Must be either 'guru' or 'devotee'

---

### 2. AvailableSlots Collection

**Purpose**: Stores available time slots that Gurus create for katha sessions.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  guruId: ObjectId,                  // Reference to User (required)
  fromDate: Date,                    // Start date of availability (required)
  toDate: Date,                      // End date of availability (required, must be > fromDate)
  location: String,                  // Location: 'North side' or 'Mountain' (required)
  availableGranths: [String],        // Array of available granths (required, min 1)
                                      // Options: 'Ramayan', 'Bhagwat', 'Mahabharat', 'Other'
  isActive: Boolean,                  // Whether slot is currently active (default: true)
  createdAt: Date                    // Slot creation timestamp
}
```

**Example Document**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "guruId": "507f1f77bcf86cd799439011",
  "fromDate": "2024-02-01T00:00:00.000Z",
  "toDate": "2024-02-15T23:59:59.000Z",
  "location": "Mountain",
  "availableGranths": ["Ramayan", "Bhagwat", "Mahabharat"],
  "isActive": true,
  "createdAt": "2024-01-20T08:00:00.000Z"
}
```

**Indexes**:
- `guruId`: For fast queries of guru's slots
- `fromDate`, `toDate`: For date range queries
- `isActive`: For filtering active slots

**Validation Rules**:
- `guruId`: Required, must reference valid User with role 'guru'
- `fromDate`: Required, must be a valid date
- `toDate`: Required, must be after `fromDate`
- `location`: Required, must be 'North side' or 'Mountain'
- `availableGranths`: Required array, must contain at least one granth
- Each granth in array must be one of: 'Ramayan', 'Bhagwat', 'Mahabharat', 'Other'

**Relationships**:
- `guruId` → `Users._id` (Many-to-One)

---

### 3. Bookings Collection

**Purpose**: Stores booking requests made by Devotees for katha sessions.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  devoteeId: ObjectId,              // Reference to User (required)
  slotId: ObjectId,                  // Reference to AvailableSlot (required)
  selectedGranth: String,            // Granth selected by devotee (required)
                                      // Must be one of: 'Ramayan', 'Bhagwat', 'Mahabharat', 'Other'
  fromDate: Date,                    // Start date of booking (required)
  toDate: Date,                      // End date of booking (required, must be > fromDate)
  location: String,                  // Location: 'North side' or 'Mountain' (required)
  status: String,                    // Booking status (default: 'Pending')
                                      // Options: 'Pending', 'Approved', 'Rejected'
  message: String,                    // Optional message from devotee
  createdAt: Date,                   // Booking creation timestamp
  updatedAt: Date                    // Last update timestamp (auto-updated)
}
```

**Example Document**:
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "devoteeId": "507f1f77bcf86cd799439014",
  "slotId": "507f1f77bcf86cd799439012",
  "selectedGranth": "Ramayan",
  "fromDate": "2024-02-05T00:00:00.000Z",
  "toDate": "2024-02-10T23:59:59.000Z",
  "location": "Mountain",
  "status": "Pending",
  "message": "Looking forward to the katha session",
  "createdAt": "2024-01-25T14:30:00.000Z",
  "updatedAt": "2024-01-25T14:30:00.000Z"
}
```

**Indexes**:
- `devoteeId`: For fast queries of devotee's bookings
- `slotId`: For fast queries of slot's bookings
- `status`: For filtering by status
- Compound: `{slotId: 1, status: 1}` for efficient guru queries

**Validation Rules**:
- `devoteeId`: Required, must reference valid User with role 'devotee'
- `slotId`: Required, must reference valid AvailableSlot
- `selectedGranth`: Required, must be one of the granths available in the slot
- `fromDate`: Required, must be within the slot's date range
- `toDate`: Required, must be after `fromDate` and within slot's date range
- `location`: Required, must be 'North side' or 'Mountain'
- `status`: Default 'Pending', can be 'Pending', 'Approved', or 'Rejected'
- `message`: Optional, trimmed string

**Relationships**:
- `devoteeId` → `Users._id` (Many-to-One)
- `slotId` → `AvailableSlots._id` (Many-to-One)

---

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│─────────────│
│ _id (PK)    │
│ name        │
│ email       │
│ password    │
│ role        │
└──────┬──────┘
       │
       │ 1
       │
       │ *
       │
┌──────▼──────────┐         ┌──────────────┐
│ AvailableSlots  │         │   Bookings   │
│─────────────────│         │──────────────│
│ _id (PK)        │◄────────│ _id (PK)     │
│ guruId (FK)     │    *    │ devoteeId(FK)│
│ fromDate        │         │ slotId (FK)  │
│ toDate          │         │ selectedGranth│
│ location        │         │ fromDate     │
│ availableGranths│         │ toDate       │
│ isActive        │         │ location     │
└─────────────────┘         │ status       │
                             │ message      │
                             └──────────────┘
```

## Data Relationships

### One-to-Many Relationships

1. **User (Guru) → AvailableSlots**
   - One Guru can create multiple available slots
   - Foreign key: `AvailableSlots.guruId`

2. **User (Devotee) → Bookings**
   - One Devotee can make multiple bookings
   - Foreign key: `Bookings.devoteeId`

3. **AvailableSlot → Bookings**
   - One Slot can have multiple bookings
   - Foreign key: `Bookings.slotId`

## Query Patterns

### Common Queries

1. **Get all active slots**
   ```javascript
   AvailableSlot.find({ isActive: true })
     .populate('guruId', 'name email')
     .sort({ fromDate: 1 })
   ```

2. **Get guru's slots**
   ```javascript
   AvailableSlot.find({ guruId: userId })
     .sort({ fromDate: 1 })
   ```

3. **Get devotee's bookings**
   ```javascript
   Booking.find({ devoteeId: userId })
     .populate('slotId')
     .sort({ createdAt: -1 })
   ```

4. **Get pending bookings for guru**
   ```javascript
   const slots = await AvailableSlot.find({ guruId: guruId });
   const slotIds = slots.map(s => s._id);
   Booking.find({ 
     slotId: { $in: slotIds }, 
     status: 'Pending' 
   })
     .populate('devoteeId', 'name email')
     .sort({ createdAt: -1 })
   ```

## Data Validation

### Application-Level Validation
- Date range validation (toDate > fromDate)
- Granth availability check (selected granth must be in slot's availableGranths)
- Date range within slot validation (booking dates must be within slot dates)
- Role-based access control

### Database-Level Validation
- Required fields enforced by Mongoose
- Enum values enforced by Mongoose
- Unique constraints on email
- Data type validation

## Migration Considerations

### Future Enhancements
- Add `updatedAt` to AvailableSlot for tracking modifications
- Add `cancelledAt` timestamp for soft deletes
- Add `notes` field to AvailableSlot for guru's internal notes
- Add `rating` and `review` fields to Booking for feedback
- Add `notificationPreferences` to User

