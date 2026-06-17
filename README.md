# Health Sphere — Full Stack with MongoDB

A full-stack health tracking app built with **React + TanStack Router** (frontend)
and **Express + MongoDB + Mongoose** (backend).

---

## Project Structure

```
health-sphere-fullstack/
├── backend/                  ← Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts         ← MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts       ← JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.ts       ← User schema (bcrypt hashed password)
│   │   │   └── HealthData.ts ← Full health data schema
│   │   ├── routes/
│   │   │   ├── auth.ts       ← /api/auth/* (signup, login, profile)
│   │   │   ├── health.ts     ← /api/health (CRUD for health data)
│   │   │   └── admin.ts      ← /api/admin/* (admin-only routes)
│   │   └── index.ts          ← Express app entry point
│   ├── .env.example          ← Copy to .env and fill in
│   ├── package.json
│   └── tsconfig.json
│
├── src/                      ← Frontend (React)
│   ├── contexts/
│   │   └── AppContext.tsx    ← ✅ Updated: uses MongoDB via API
│   ├── lib/
│   │   └── api/
│   │       └── client.ts     ← ✅ New: API client with JWT
│   └── routes/
│       ├── login.tsx         ← ✅ Updated: async login
│       └── signup.tsx        ← ✅ Updated: async signup
├── .env.example              ← Copy to .env for frontend
└── package.json              ← Frontend deps (unchanged)
```

---

## How to Connect MongoDB

### Option A — Local MongoDB (fastest for development)

1. **Install MongoDB Community** from https://www.mongodb.com/try/download/community
2. Start it:
   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community

   # Ubuntu/Debian
   sudo systemctl start mongod

   # Windows — MongoDB is a Windows Service, starts automatically
   ```
3. Your connection string is: `mongodb://localhost:27017/healthsphere`

### Option B — MongoDB Atlas (free cloud, no install needed)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a **Free Cluster** (M0, pick any region)
3. Under **Database Access** → Add a user with a password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all) for dev, or your specific IP
5. Click **Connect** → **Connect your application** → copy the URI
   It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthsphere`
6. Paste this into `backend/.env` as `MONGODB_URI`

---

## Setup & Run

### Step 1 — Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/healthsphere   # or your Atlas URI
JWT_SECRET=some_long_random_string_at_least_32_chars
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
# → 🚀 Health Sphere API running on http://localhost:5000
# → ✅ MongoDB connected: localhost
```

### Step 2 — Frontend setup

```bash
# From project root
npm install   # or: bun install

# Create frontend .env
cp .env.example .env
```

Edit root `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev   # or: bun dev
# → Frontend at http://localhost:3000
```

### Step 3 — Open the app

Visit http://localhost:3000

- Click **Sign up** to create a real account (stored in MongoDB)
- Or click **Continue as Demo User** (demo@health.app / demo1234)

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path               | Auth | Description            |
|--------|--------------------|------|------------------------|
| POST   | `/signup`          | ❌   | Register new user      |
| POST   | `/login`           | ❌   | Login, returns JWT     |
| GET    | `/me`              | ✅   | Get current user       |
| PATCH  | `/profile`         | ✅   | Update profile fields  |
| POST   | `/change-password` | ✅   | Change password        |

**Signup body:**
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "secure123",
  "phone": "+91 9876543210",
  "gender": "Male",
  "dob": "1990-05-15"
}
```

**Login response:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "6672abc...",
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "role": "user"
  }
}
```

### Health Data — `/api/health` (all require JWT)

| Method | Path       | Description                              |
|--------|------------|------------------------------------------|
| GET    | `/health`  | Get all health data for logged-in user   |
| PUT    | `/health`  | Replace full health data (sync from app) |
| PATCH  | `/health`  | Partially update health data             |
| DELETE | `/health`  | Reset health data to empty               |

### Admin — `/api/admin` (requires admin role)

| Method | Path            | Description           |
|--------|-----------------|-----------------------|
| GET    | `/users`        | List all users        |
| DELETE | `/users/:id`    | Delete a user         |
| GET    | `/stats`        | Usage statistics      |

To make a user an admin, register with an email containing "admin"
(e.g., `admin@yoursite.com`) or update directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## How Authentication Works

```
User signs up → POST /api/auth/signup
                ↓
          MongoDB saves user (password bcrypt-hashed)
          Default health data created
                ↓
          JWT token returned (7-day expiry)
                ↓
Frontend stores token in localStorage ("hs:token")
Every API call sends: Authorization: Bearer <token>
                ↓
Backend middleware verifies token → extracts userId
```

---

## Data Sync Strategy

Health data is **auto-saved to MongoDB every 2 seconds** after any change
(debounced). On page load, it fetches the latest data from the server so all
devices stay in sync.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable       | Required | Description                         |
|----------------|----------|-------------------------------------|
| `MONGODB_URI`  | ✅       | MongoDB connection string           |
| `JWT_SECRET`   | ✅       | Secret key for signing JWTs         |
| `PORT`         | ❌       | API server port (default: 5000)     |
| `CLIENT_URL`   | ❌       | Frontend URL for CORS               |
| `NODE_ENV`     | ❌       | `development` or `production`       |

### Frontend (`.env`)

| Variable       | Required | Description                         |
|----------------|----------|-------------------------------------|
| `VITE_API_URL` | ✅       | Backend API base URL                |

---

## Production Deployment

**Backend:** Deploy to Railway, Render, or any Node.js host.
Set all env variables in the host dashboard.

**Frontend:** Deploy to Vercel or Netlify.
Set `VITE_API_URL` to your deployed backend URL.

**Database:** Use MongoDB Atlas — free tier is sufficient to start.

Make sure to set `CLIENT_URL` in your backend env to your deployed frontend
URL so CORS allows requests from it.
