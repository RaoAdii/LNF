# Version History

This file tracks release-level changes for the LNF project.

## Versioning Scheme

We use semantic versioning:
- MAJOR: breaking API or architecture changes
- MINOR: backward-compatible features
- PATCH: fixes, refactors, and documentation updates

## 1.4.0 - Messaging Upgrade and Documentation Refresh (2026-04-12)

### Added
- Threaded messaging routes:
  - GET /api/messages/conversations
  - GET /api/messages/thread/:otherUserId/:postId
  - POST /api/messages/reply
  - PUT /api/messages/read/:otherUserId/:postId
- Message read state via `isRead` in message model
- Conversation grouping by other user + post
- Polling-based thread updates on frontend (3s)

### Changed
- Messages page rewritten to conversation/thread split view
- MessageBox behavior improved with in-context success and conversation CTA
- API service extended with dedicated chat helper functions
- Core markdown documentation rewritten for production operations and originality

### Fixed
- Route not found confusion on messaging endpoints after stale process restarts
- Double upload path handling for post images in frontend rendering
- Placeholder focus/blur behavior consistency in auth and post forms

## 1.3.0 - UX and Form Behavior Improvements (2026-04-11)

### Changed
- Floating label behavior aligned across input components
- Navbar and auth pages branding standardized
- Input placeholder visibility tuned for focus-first display

## 1.2.0 - Stability and API Hardening (2026-04-10)

### Changed
- Improved backend startup diagnostics and error messaging
- Added safer MongoDB connection troubleshooting output
- Refined environment validation and boot-time checks

## 1.1.0 - Core Feature Completion (2026-04-10)

### Added
- Authentication flow (register/login/profile)
- Post CRUD with image upload support
- Search and filter behavior for feed
- Initial inbox/sent message support

## 1.0.0 - Initial MVP Baseline (2026-04-09)

### Added
- Initial MERN scaffold and route structure
- Base UI pages and navigation
- MongoDB models and API controllers

## Upcoming

Planned but not yet scheduled:
- Push notifications
- Admin moderation tools
- Reporting and audit workflow
- Optional websocket mode for instant chat
