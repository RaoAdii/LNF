# Setup Guide

This guide is intended for contributors and deployment engineers who need predictable setup steps for local development and production rollout.

## 1. Local Development

### 1.1 Clone and open project

```bash
cd d:\
git clone <repo-url> LNF
cd LNF
```

### 1.2 Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_random_value
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start API:

```bash
npm run dev
```

Expected: server listens on port 5000 and connects to MongoDB.

### 1.3 Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Expected: Vite serves app on port 5173.

## 2. Verify Core Flows

Run through these in order:

1. Register user
2. Login
3. Create post with image
4. Open post detail
5. Send contact message
6. Open messages and verify thread appears
7. Reply and verify thread updates

## 3. Production Setup

### 3.1 Backend

- Set `NODE_ENV=production`
- Set real `FRONTEND_URL` origin
- Use secure secrets for JWT and database
- Run with process manager (PM2/systemd/container)

Example PM2:

```bash
cd backend
npm install --omit=dev
pm2 start server.js --name lnf-api
pm2 save
```

### 3.2 Frontend

```bash
cd frontend
npm ci
npm run build
```

Publish `dist` to your static host.

### 3.3 Reverse proxy and TLS

- Route `/api/*` to backend service
- Route frontend assets from static host
- Enforce HTTPS
- Add compression and cache headers for static assets

## 4. Security Hardening

- Rotate JWT secret periodically
- Restrict CORS origins
- Restrict MongoDB network access
- Back up database daily
- Monitor logs for repeated 401/403/500 spikes

## 5. Operational Checks Before Release

- API health endpoint returns 200
- Upload folder writable
- Message routes return expected auth behavior
- Client can read/write posts and messages
- Error toasts show useful messages for failures

## 6. Fast Debug Notes

### Route exists check

```bash
curl -i http://localhost:5000/api/messages/conversations
```

Expected without token: `401`.

### Port conflict on 5000

PowerShell:

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Clean install if dependencies drift

```bash
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```
