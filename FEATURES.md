# Feature Reference

This document describes implemented product behavior as it exists in the repository today.

## 1. Authentication

- Registration with validation and password confirmation
- Login with JWT token issuance
- Profile endpoint for authenticated user context
- Frontend route protection with redirect to login when needed

## 2. Lost/Found Post Lifecycle

- Create lost or found post
- Upload one image per post
- Edit post details and optionally replace image
- Delete post (owner-only)
- Mark post as resolved

### Search and Discovery

- Keyword query across post text
- Filter by type: lost/found
- Filter by category
- Combined query and filter support

## 3. Messaging (Threaded Chat)

Messaging is now conversation-first and grouped by user + post.

### Conversation list

- Shows all conversations where current user is sender or receiver
- Group key: other user id + post id
- Shows last message preview and timestamp
- Shows unread indicator

### Thread view

- Displays chronological messages (oldest first)
- Distinct sent and received bubble styles
- Date separators in long threads
- Marks incoming messages as read when opening thread

### Reply flow

- Reply within active thread
- Enter sends message; Shift+Enter adds new line
- Optimistic append for instant feedback
- Background polling every 3 seconds to keep thread fresh

### Contact owner box (Post detail)

- Message composer opens inline
- Success state remains visible after send
- Session dedupe avoids repeated initial outreach in same session
- Shortcut link to open Messages page

## 4. UX and Interaction

- Glass-style cards and surfaces
- Animated page and component transitions
- Skeleton loading states
- Error/success toasts for async actions
- Responsive layout across mobile/tablet/desktop

## 5. Data Integrity and Validation

- Server-side request validation for auth, posts, and messages
- ObjectId validation for thread/reply route params
- Upload MIME/type and size controls
- Ownership checks for post mutation endpoints

## 6. Security Features

- Password hashing with bcrypt
- JWT-protected API routes
- Auth interceptors on frontend
- CORS allowlist support

## 7. Operational Features

- Health endpoint for readiness checks
- Startup environment validation
- Upload directory auto-creation
- Graceful shutdown support

## 8. Known Scope Boundaries

- Polling is used instead of WebSocket real-time transport
- No admin moderation console in current release
- No external push notifications in current release
