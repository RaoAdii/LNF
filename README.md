# LNF - Lost & Found Hub

LNF is a full-stack community Lost & Found application built with React, Node.js, Express, and MongoDB.
It supports authenticated posting, search/filter, realtime messaging, profile management, and admin moderation.

## Current Status

This codebase is actively maintained and production-oriented with:
- Dark, token-based UI system across pages
- DotGrid interactive landing hero background
- JWT auth + protected routes
- Realtime messaging over Socket.IO with API fallback
- Admin console for users and listings
- Automatic default admin seeding on backend startup

## Tech Stack

### Frontend
- React 18 + Vite
- React Router 6
- Tailwind CSS + custom design tokens
- Framer Motion
- Axios
- Formik + Yup
- Socket.IO client
- GSAP (DotGrid interaction)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Multer uploads (disk storage)
- Socket.IO server
- express-validator
- CORS + compression

## Core Features

- Authentication
  - Register, login, and profile fetch
  - Profile update (name/contact fields + avatar upload)
  - Role-aware protected routes (user/admin)

- Listings
  - Create, edit, delete lost/found posts
  - Category + status support (`open`, `resolved`)
  - Feed search and filtering (query/type/category)
  - Pagination metadata and feed summary counts

- Messaging
  - Conversation list grouped by `otherUser + post`
  - Thread view with date separators and read tracking
  - Realtime send/read/typing via websockets
  - API fallback mode when socket is disconnected

- Admin Console
  - Platform stats
  - Ban/unban users
  - Promote/demote admin role
  - Toggle listing type/status
  - Delete listings

## Default Admin Seeding

On backend boot, a default admin account is auto-created/synced.

Default credentials (if not overridden):
- Email: `admin@lnf.local`
- Password: `Admin@123456`

Override with env vars:
- `ADMIN_TEST_NAME`
- `ADMIN_TEST_EMAIL`
- `ADMIN_TEST_PASSWORD`
- `ADMIN_RESET_PASSWORD_ON_BOOT`

Note: Use strong custom values in production.

## Quick Start

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: usually `http://localhost:5173`

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
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

# Optional email service config (not required for current auth flow)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-gmail@gmail.com
OTP_EXPIRES_MINUTES=10
APP_NAME=LostHub
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT_MS=15000
```

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Posts
- `GET /api/posts`
- `GET /api/posts/:id`
- `GET /api/posts/my-posts`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

### Messages
- `POST /api/messages`
- `GET /api/messages/inbox`
- `GET /api/messages/sent`
- `GET /api/messages/conversations`
- `GET /api/messages/thread/:otherUserId/:postId`
- `POST /api/messages/reply`
- `PUT /api/messages/read/:otherUserId/:postId`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/posts`
- `PATCH /api/admin/posts/:id`
- `DELETE /api/admin/posts/:id`
- `PATCH /api/admin/users/:id/ban`
- `PATCH /api/admin/users/:id/promote`

### Health
- `GET /api/health`

## Realtime Events (Socket.IO)

Client emits:
- `conversation:join`
- `conversation:leave`
- `message:send`
- `typing:start`
- `typing:stop`
- `messages:read`

Server emits:
- `message:new`
- `typing:indicator`
- `messages:read-ack`
- `notification:message`
- `presence:update`

## Build & Deploy

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

Backend:
```bash
cd backend
npm start
```

Recommended deployment pattern:
- Deploy backend as Node service
- Deploy frontend `dist` to static host
- Set `VITE_API_URL` to backend public URL if cross-origin
- Restrict CORS to known origins

## Documentation Map

- [SETUP.md](./SETUP.md)
- [FEATURES.md](./FEATURES.md)
- [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)
- [VERSION.md](./VERSION.md)
