# Quick Reference

## Run Commands

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Required Backend Env

```env
PORT=5000
MONGO_URI=<mongodb-uri>
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Common Optional Backend Env

```env
DB_MAX_ATTEMPTS=3
DB_RETRY_DELAY_MS=5000
CORS_ORIGINS=

ADMIN_TEST_NAME=Test Admin
ADMIN_TEST_EMAIL=admin@lnf.local
ADMIN_TEST_PASSWORD=Admin@123456
ADMIN_RESET_PASSWORD_ON_BOOT=false

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=
OTP_EXPIRES_MINUTES=10
APP_NAME=LostHub
```

## Optional Frontend Env

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT_MS=15000
```

## Default Admin Credentials

If you did not override `ADMIN_TEST_*`:
- Email: `admin@lnf.local`
- Password: `Admin@123456`

## Route Summary

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
- `DELETE /api/admin/users/:id`

## Socket Event Names

Client -> Server:
- `conversation:join`
- `conversation:leave`
- `message:send`
- `typing:start`
- `typing:stop`
- `messages:read`

Server -> Client:
- `message:new`
- `typing:indicator`
- `messages:read-ack`
- `notification:message`
- `presence:update`

## Fast Checks

```bash
curl -i http://localhost:5000/api/health
curl -i http://localhost:5000/api/messages/conversations
```

Expected:
- health -> `200` when DB connected
- conversations without token -> `401`

## Useful Fixes

### Port 5000 in use (PowerShell)
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Reset local auth state (browser console)
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### Hard refresh dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```
