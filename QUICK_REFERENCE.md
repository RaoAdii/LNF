# Quick Reference

## Local Run Commands

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

### Production Build (Frontend)
```bash
cd frontend
npm run build
npm run preview
```

## Required Environment Variables

### Backend
```env
PORT=5000
MONGO_URI=<mongodb-uri>
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (optional)
```env
VITE_API_URL=http://localhost:5000
```

## Route Summary

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Posts
- GET /api/posts
- GET /api/posts/:id
- GET /api/posts/my-posts
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id

### Messages
- POST /api/messages
- GET /api/messages/inbox
- GET /api/messages/sent
- GET /api/messages/conversations
- GET /api/messages/thread/:otherUserId/:postId
- POST /api/messages/reply
- PUT /api/messages/read/:otherUserId/:postId

## Validation Rules (Common)

- Auth token required on protected routes.
- Message reply body requires receiverId, postId, messageText.
- Uploads restricted to image MIME types and size limits.

## Fast Health Checks

```bash
curl -i http://localhost:5000/api/health
curl -i http://localhost:5000/api/messages/conversations
```

Expected:
- /api/health -> 200
- /api/messages/conversations without token -> 401

## Common Fixes

### Port 5000 busy (PowerShell)
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Clear frontend auth state
Open browser devtools console:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### Reinstall dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Release Day Checklist

1. Pull latest main.
2. Confirm both apps run locally.
3. Run smoke test: auth, post create, message send, message reply.
4. Build frontend successfully.
5. Deploy backend and frontend.
6. Verify health route and chat polling behavior.
