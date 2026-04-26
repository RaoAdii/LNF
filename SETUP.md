# Setup Guide

This guide reflects the current repository state and startup behavior.

## 1. Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (Atlas or local)

## 2. Local Development

There is no root `package.json`; run frontend and backend separately.

### 2.1 Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
DB_MAX_ATTEMPTS=3
DB_RETRY_DELAY_MS=5000
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=

# Optional admin seed overrides
ADMIN_TEST_NAME=Test Admin
ADMIN_TEST_EMAIL=admin@lnf.local
ADMIN_TEST_PASSWORD=Admin@123456
ADMIN_RESET_PASSWORD_ON_BOOT=false

# Optional SMTP (not required for login/register)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-gmail@gmail.com
OTP_EXPIRES_MINUTES=10
APP_NAME=LostHub
```

Start backend:

```bash
npm run dev
```

Expected:
- API available at `http://localhost:5000`
- `GET /api/health` returns 200 when DB is connected
- Admin account gets auto-seeded on startup

### 2.2 Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT_MS=15000
```

Expected:
- Frontend available at `http://localhost:5173` (or another Vite port)

## 3. First-Run Validation

Run through this checklist after startup:

1. Open landing page and verify DotGrid hero background loads.
2. Register a user and login.
3. Create a listing with image upload.
4. Browse listings and test filters.
5. Open a post and send a message.
6. Open messages and verify thread/conversation rendering.
7. Login as admin and verify `/admin` actions.

## 4. Admin Login (Default Seed)

If you did not override admin env vars:
- Email: `admin@lnf.local`
- Password: `Admin@123456`

If login fails:
1. Confirm backend is running with correct `MONGO_URI`.
2. Restart backend (seeding runs on startup).
3. Check custom `ADMIN_TEST_*` values in `.env`.

## 5. Production Setup

### Backend

```bash
cd backend
npm install --omit=dev
npm start
```

Set:
- `NODE_ENV=production`
- strict `FRONTEND_URL` / `CORS_ORIGINS`
- secure JWT and DB credentials
- secure admin seed credentials

### Frontend

```bash
cd frontend
npm ci
npm run build
```

Deploy `frontend/dist` to static hosting.

## 6. Troubleshooting

### Health check

```bash
curl -i http://localhost:5000/api/health
```

### Confirm protected route behavior

```bash
curl -i http://localhost:5000/api/messages/conversations
```

Expected without token: `401`

### Port conflict on 5000 (PowerShell)

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Fresh install

```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Frontend not reflecting Tailwind/theme changes

Restart `npm run dev` in `frontend` after config/token updates.
