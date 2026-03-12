# ✈️ SkyBook — Flight Booking System

A full-stack flight booking web application built with Node.js, Express, MongoDB, and React. Users can register, verify their email, search for flights, book seats, and manage their bookings.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens), bcrypt |
| Email | Nodemailer + Mailtrap (sandbox testing) |
| Frontend | React, Vite, Tailwind CSS, Axios |

---

## 📁 Project Structure

```
flight-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # JWT auth middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   └── utils/          # Email sender, code generator
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Navbar, FlightCard, BookingCard, etc.
│   │   ├── context/        # Auth context
│   │   └── pages/          # Register, Login, VerifyEmail, Home, MyBookings
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017
- A Mailtrap account (for email testing) — or a Gmail account with App Password enabled

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd flight-booking-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder (see Environment Variables section below), then:

```bash
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder with the following:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/flight-booking

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
MAIL_FROM=noreply@flightbooking.com
```

> **Note:** Get your Mailtrap credentials from [mailtrap.io](https://mailtrap.io) → Sandboxes → My Sandbox → Integration → SMTP tab. Use port **587** if port 2525 is blocked on your network.

---

## 📬 API Endpoints

### Auth

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/verify-email` | No | Verify email with 6-digit code |
| POST | `/api/auth/login` | No | Login and receive JWT token |

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dareen",
  "email": "dareen@gmail.com",
  "password": "123456"
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "dareen@gmail.com",
  "code": "107901"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "dareen@gmail.com",
  "password": "123456"
}
```

Response includes a `token` — use it as `Authorization: Bearer <token>` for all protected routes.

---

### Flights

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/flights` | ✅ Yes | Add a new flight |
| GET | `/api/flights` | No | Get all flights |
| GET | `/api/flights/:id` | No | Get flight by ID |
| PUT | `/api/flights/:id` | ✅ Yes | Update flight details |
| DELETE | `/api/flights/:id` | ✅ Yes | Delete a flight |
| GET | `/api/flights/search` | No | Search flights by from, to, date |

#### Add Flight
```http
POST /api/flights
Authorization: Bearer <token>
Content-Type: application/json

{
  "flightNumber": "MS401",
  "from": "Cairo",
  "to": "Dubai",
  "date": "2026-05-01T10:00:00.000Z",
  "totalSeats": 150,
  "availableSeats": 150,
  "price": 299
}
```

#### Search Flights
```http
GET /api/flights/search?from=Cairo&to=Dubai&date=2026-05-01
```

All three query parameters (`from`, `to`, `date`) are optional — you can search with any combination.

---

### Bookings

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/bookings` | ✅ Yes | Book a flight |
| GET | `/api/bookings/my-bookings` | ✅ Yes | Get current user's bookings |
| PUT | `/api/bookings/:id/cancel` | ✅ Yes | Cancel a booking |

#### Book a Flight
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "flightId": "<flight _id from database>",
  "numberOfSeats": 2
}
```

#### Cancel a Booking
```http
PUT /api/bookings/<bookingId>/cancel
Authorization: Bearer <token>
```

---

## 🔄 Full User Flow

1. **Register** → POST `/api/auth/register`
2. **Check Mailtrap inbox** → copy the 6-digit verification code
3. **Verify email** → POST `/api/auth/verify-email`
4. **Login** → POST `/api/auth/login` → save the returned `token`
5. **Add flights** → POST `/api/flights` (with token)
6. **Search flights** → GET `/api/flights/search`
7. **Book a flight** → POST `/api/bookings` (with token)
8. **View bookings** → GET `/api/bookings/my-bookings` (with token)
9. **Cancel booking** → PUT `/api/bookings/:id/cancel` (with token)

---

## 🧪 Testing with Postman

Import the included `documents/FlightBookingSystem.postman_collection.json` into Postman.

Set up an environment with:
- `base_url` = `http://localhost:5000`
- `token` = (auto-filled after login via the Tests script)

The Login request includes a test script that automatically saves the JWT token to the environment variable so all subsequent protected requests work without manual copy-pasting.

---

## 🗄️ Database Collections

### Users
| Field | Type | Description |
|---|---|---|
| name | String | User's full name |
| email | String | Unique email address |
| password | String | bcrypt hashed |
| isVerified | Boolean | Email verification status |
| verificationCode | String | 6-digit code (cleared after use) |
| verificationCodeExpires | Date | Expires 10 minutes after registration |

### Flights
| Field | Type | Description |
|---|---|---|
| flightNumber | String | Unique flight identifier |
| from | String | Departure city |
| to | String | Arrival city |
| date | Date | Flight date and time |
| totalSeats | Number | Total seat capacity |
| availableSeats | Number | Remaining bookable seats |
| price | Number | Price per seat |

### Bookings
| Field | Type | Description |
|---|---|---|
| userId | ObjectId | Reference to Users |
| flightId | ObjectId | Reference to Flights |
| bookingDate | Date | When the booking was made |
| numberOfSeats | Number | Seats booked |
| totalPrice | Number | numberOfSeats × price |
| status | String | `confirmed` or `canceled` |

---

## 👥 Group Members

- Dareen
- Maya

---

*SWAPD352 Web Development — Spring 2026*
