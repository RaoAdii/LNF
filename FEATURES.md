# Feature Reference

This document lists implemented behavior as of the current codebase.

## 1. Authentication & Session

- User registration with validation
- User login with JWT token issuance
- Protected route access using Bearer auth
- Profile fetch (`GET /api/auth/profile`)
- Profile update (`PUT /api/auth/profile`) with avatar upload
- Local session persistence in frontend (`localStorage`)

## 2. Listings Lifecycle

- Create lost/found listing with image upload
- Edit listing content and status (`open`/`resolved`)
- Delete listing (owner-only)
- View listing feed and listing detail pages
- Owner dashboard (`/my-posts`) with quick actions

## 3. Search & Discovery

- Text query filtering (`q`) by title/description/location
- Filter by type (`lost` / `found`)
- Filter by category
- Paginated feed response with metadata (`page`, `totalPages`, `hasMore`)
- Feed summary counts (`lostCount`, `foundCount`, `resolvedCount`)

## 4. Messaging

### API Messaging
- Send initial message from post detail
- Read inbox and sent messages
- Conversation aggregation endpoint
- Thread endpoint grouped by post + user
- Reply endpoint
- Mark thread as read endpoint

### Realtime Messaging (Socket.IO)
- Authenticated websocket connection
- Room join/leave by `user pair + post`
- Realtime message delivery (`message:new`)
- Typing indicator events
- Read acknowledgement events
- Presence updates

### Resilience
- UI falls back to periodic API refresh when socket disconnects
- Send path falls back to REST reply endpoint when needed

## 5. Admin Console

- Dedicated admin route (`/admin`)
- Stats overview (users, posts, open/resolved, messages)
- User moderation:
  - ban/unban user
  - promote/demote admin role
  - delete user permanently (with related post/message cleanup)
- Listing moderation:
  - toggle listing type (`lost` / `found`)
  - toggle listing status (`open` / `resolved`)
  - delete listing

## 6. Landing & Theming

- Interactive DotGrid background on landing hero
- Floating navbar on landing with dock animation when navigating to auth pages
- Unified dark theme across app pages
- Token-based typography/color system (`text-ink-primary`, `text-ink-secondary`, `text-ink-muted`)

## 7. UX & Performance

- Lazy-loaded route chunks via `React.lazy`
- Skeleton loading states for key pages
- Motion transitions via Framer Motion + CSS keyframes
- Axios timeout and retry behavior for key read requests
- Cached static asset headers on backend for uploads
- Compression enabled on backend responses

## 8. Data Validation & Integrity

- express-validator on auth/posts/messages routes
- Mongoose schema validation and enums
- MIME/type + file size validation for uploads
- Ownership checks for listing mutations
- Ban enforcement in auth middleware and socket auth

## 9. Operational Behavior

- Startup environment checks (`MONGO_URI`, `JWT_SECRET`)
- Health endpoint (`/api/health`)
- Graceful server shutdown handling
- Automatic test/admin account seeding at DB connect time

## 10. Scope Notes

- Cloudinary and SMTP utilities exist but are not part of the current primary auth flow.
- No automated test suite is included yet in this repository.
