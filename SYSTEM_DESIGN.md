# System Design - Spiritual Katha Booking Website

## 📐 Architecture Overview

The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│              React.js Frontend (Port 3000)              │
│  - User Interface Components                            │
│  - State Management (Context API)                      │
│  - Routing (React Router)                              │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                    │
│          Node.js + Express Backend (Port 5000)          │
│  - RESTful API Endpoints                                │
│  - Authentication & Authorization (JWT)                 │
│  - Business Logic (Controllers)                         │
│  - Middleware (Auth, Role-based Access)                 │
└─────────────────────────────────────────────────────────┘
                          ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                         │
│              MongoDB Database                           │
│  - User Collection                                      │
│  - AvailableSlot Collection                             │
│  - Booking Collection                                   │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### 1. User Authentication Flow
```
User → Frontend (Login Form)
  → POST /api/auth/login
  → Backend validates credentials
  → JWT token generated
  → Token stored in localStorage
  → User redirected to appropriate dashboard
```

### 2. Guru Slot Creation Flow
```
Guru → Dashboard → Create Slot Form
  → POST /api/slots (with JWT token)
  → Backend validates (Guru role check)
  → Slot saved to MongoDB
  → Response with slot data
  → Frontend updates UI
```

### 3. Devotee Booking Flow
```
Devotee → Homepage → View Available Slots
  → Select Slot → Booking Form
  → POST /api/bookings (with JWT token)
  → Backend validates:
     - Slot exists and is active
     - Selected granth is available
     - Dates are within slot range
  → Booking created with "Pending" status
  → Response with booking data
  → Frontend shows confirmation
```

### 4. Booking Approval Flow
```
Guru → Dashboard → Pending Bookings
  → PUT /api/bookings/:id/approve (with JWT token)
  → Backend validates:
     - User is Guru
     - Slot belongs to Guru
  → Booking status updated to "Approved"
  → Response with updated booking
  → Devotee can see updated status
```

## 🗄️ Database Schema Details

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['guru', 'devotee'], default: 'devotee'),
  createdAt: Date
}
```

**Indexes:**
- `email`: Unique index for fast lookups

### AvailableSlot Collection
```javascript
{
  _id: ObjectId,
  guruId: ObjectId (ref: User, required),
  fromDate: Date (required),
  toDate: Date (required, must be > fromDate),
  location: String (enum: ['North side', 'Mountain'], required),
  availableGranths: [String] (
    enum: ['Ramayan', 'Bhagwat', 'Mahabharat', 'Other'],
    required,
    minLength: 1
  ),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

**Indexes:**
- `guruId`: For fast queries of guru's slots
- `fromDate`, `toDate`: For date range queries
- `isActive`: For filtering active slots

### Booking Collection
```javascript
{
  _id: ObjectId,
  devoteeId: ObjectId (ref: User, required),
  slotId: ObjectId (ref: AvailableSlot, required),
  selectedGranth: String (
    enum: ['Ramayan', 'Bhagwat', 'Mahabharat', 'Other'],
    required
  ),
  fromDate: Date (required, must be within slot range),
  toDate: Date (required, must be > fromDate, within slot range),
  location: String (enum: ['North side', 'Mountain'], required),
  status: String (
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  ),
  message: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `devoteeId`: For fast queries of devotee's bookings
- `slotId`: For fast queries of slot's bookings
- `status`: For filtering by status
- Compound: `{slotId: 1, status: 1}` for guru's pending bookings

## 🔐 Security Architecture

### Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Token Storage**: localStorage (frontend)
- **Token Expiry**: 30 days
- **Password Hashing**: bcryptjs with salt rounds: 10

### Authorization
- **Role-Based Access Control (RBAC)**:
  - `guru`: Can create slots, approve/reject bookings
  - `devotee`: Can view slots, create bookings
- **Middleware Chain**:
  1. `protect`: Verifies JWT token
  2. `roleCheck`: Verifies user role

### API Security
- CORS enabled for frontend origin
- Input validation on all endpoints
- SQL Injection prevention (MongoDB NoSQL injection protection)
- XSS prevention (React's built-in escaping)

## 📊 Data Flow Diagrams

### Complete Booking Lifecycle
```
┌──────────┐
│   Guru   │
└────┬─────┘
     │ 1. Creates Slot
     ▼
┌──────────────┐
│ AvailableSlot│
│  (isActive)  │
└────┬─────────┘
     │ 2. Visible to Devotees
     ▼
┌──────────┐
│ Devotee  │
└────┬─────┘
     │ 3. Creates Booking
     ▼
┌──────────────┐
│   Booking    │
│ (Pending)    │
└────┬─────────┘
     │ 4. Guru Reviews
     ▼
┌──────────────┐
│   Booking    │
│(Approved/    │
│ Rejected)    │
└──────────────┘
```

## 🚀 API Endpoint Structure

### Authentication Endpoints
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
```

### Slot Endpoints
```
GET    /api/slots           - Get all active slots (Public)
POST   /api/slots           - Create slot (Guru only)
GET    /api/slots/my-slots  - Get guru's slots (Guru only)
PUT    /api/slots/:id       - Update slot (Guru only)
DELETE /api/slots/:id       - Delete slot (Guru only)
```

### Booking Endpoints
```
POST   /api/bookings              - Create booking (Devotee only)
GET    /api/bookings              - Get user's bookings (Protected)
GET    /api/bookings/pending      - Get pending bookings (Guru only)
PUT    /api/bookings/:id/approve  - Approve booking (Guru only)
PUT    /api/bookings/:id/reject  - Reject booking (Guru only)
```

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── Router
│   ├── Navbar
│   └── Routes
│       ├── Home
│       │   └── SlotCard (multiple)
│       ├── Login
│       ├── Dashboard (Guru)
│       │   ├── BookingCard (multiple)
│       │   └── Slot Management
│       ├── Bookings (Devotee)
│       │   └── BookingCard (multiple)
│       └── AvailableSlots (Booking Form)
```

### State Management
- **Context API**: Global authentication state
- **Local State**: Component-specific state (forms, UI)
- **API Service**: Centralized API calls with interceptors

## 🔄 Error Handling

### Backend Error Responses
```javascript
{
  success: false,
  message: "Error description"
}
```

### Frontend Error Handling
- Try-catch blocks in async functions
- User-friendly error messages
- Network error handling
- Token expiry handling (auto-logout)

## 📈 Scalability Considerations

### Current Architecture
- Single server (Node.js)
- Single database (MongoDB)
- Stateless API (JWT tokens)

### Future Enhancements
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: For large-scale deployments
- **CDN**: For static frontend assets
- **Message Queue**: For async booking notifications

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Database connection tests

### Frontend Testing
- Component unit tests
- Integration tests for user flows
- E2E tests for critical paths

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spiritual-katha
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

