# LNF - Lost and Found Hub

LNF is a MERN application built for residential communities to report lost/found items, connect owners with finders, and continue communication through threaded in-app messaging.

This repository is maintained as a practical, deployment-ready codebase with clear separation between API, UI, and operational documentation.

## What The App Solves

- Residents can post lost or found items with photos.
- Community members can search by keyword, type, and category.
- Post owners can manage lifecycle states (open/resolved) and edits.
- Users can contact each other about a specific post and continue the conversation in a chat thread.

## Current Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt password hashing
- Multer image uploads
- express-validator request validation

### Frontend
- React 18 + Vite
- React Router 6
- Axios with auth interceptors
- Formik + Yup forms/validation
- Tailwind CSS + custom token-based design system
- Framer Motion transitions and interaction animations

## Core Capabilities

- Authentication: register/login/profile with protected routes
- Posts: create, read, update, delete, mark resolved
- Uploads: image storage and static file serving
- Search/filter: live query across post fields
- Messaging:
  - conversation list grouped by user + post
  - full thread view
  - reply inside thread
  - unread tracking
  - polling refresh every 3 seconds

## Local Development

### Prerequisites
- Node.js 18+ recommended
- npm 9+
- MongoDB Atlas (or local MongoDB)

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend default URL: http://localhost:5000

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: http://localhost:5173
Note: Vite may auto-switch to another port if 5173 is busy.

## Environment Variables

Create backend `.env`:

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
```

`FRONTEND_URL` accepts one origin. Use `CORS_ORIGINS` for additional comma-separated origins in production.

Optional frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

In production, set `VITE_API_URL` to your backend public URL when frontend and backend are on different domains.

## API Surface (High Level)

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

## Messaging Data Model (Current)

Message documents include:

- senderId
- receiverId
- postId
- messageText
- isRead
- createdAt

Conversations are grouped by:
- other user
- post id

This allows multiple parallel conversations with the same person on different posts.

## Production Readiness Checklist

Use this checklist before releasing.

### Security
- Strong JWT secret in production
- MongoDB user with least privileges
- CORS restricted to known domains
- No secrets committed to git
- Input validation enabled on all write endpoints

### Reliability
- Process manager for API (PM2/systemd/container orchestration)
- Health checks wired to deployment platform
- Graceful shutdown enabled
- Log retention policy defined

### Performance
- Image upload limits enforced
- Static assets served via CDN/reverse proxy when needed
- Query indexes reviewed for hot paths (messages, posts)

### Operations
- Daily database backup policy
- Rollback plan for frontend and backend
- Release checklist with smoke tests

## Recommended Deployment Pattern

### Backend
- Build target: Node server
- Run with `npm start`
- Place behind reverse proxy (Nginx/Cloud load balancer)
- Configure environment variables via host secret manager

### Frontend
- Build with `npm run build`
- Deploy static assets to Vercel/Netlify/S3+CDN
- Set `VITE_API_URL` to public backend URL

## Smoke Test Script (Manual)

After deploy:

1. Register a test user
2. Login and verify profile endpoint
3. Create a post with image
4. View post in public feed
5. Send message from post detail
6. Open messages page and verify conversation/thread load
7. Reply in thread and verify optimistic update + polling sync

## Common Troubleshooting

### 404 on new message routes
- Restart backend after pulling new code
- Confirm route exists: GET /api/messages/conversations (should return 401 without token, not 404)

### MongoDB connection failures
- Check Atlas network access/IP allowlist
- Confirm MONGO_URI and credentials

### Images not loading
- Confirm backend static mount `/uploads`
- Verify stored imageUrl starts with `/uploads/...`

### Token issues
- Clear localStorage and sign in again
- Confirm frontend is sending Authorization header

## Documentation Map

- Setup guide: SETUP.md
- Feature map: FEATURES.md
- File layout: FILE_STRUCTURE.md
- Developer quick commands: QUICK_REFERENCE.md
- Version log: VERSION.md
- Design system: DESIGN_SYSTEM_REFERENCE.md
