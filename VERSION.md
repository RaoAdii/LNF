# Version History

This file tracks release-level changes for LNF.

## Versioning Scheme

Semantic versioning:
- MAJOR: breaking contract/architecture changes
- MINOR: backward-compatible features
- PATCH: fixes/docs/refactors

## 1.6.0 - Dark Theme Consolidation + Docs Refresh (2026-04-26)

### Added
- DotGrid hero background integration on landing page (`gsap`-powered interaction)
- Global dark-theme text enforcement with `ink` utility overrides
- Floating-to-docked navbar transition flow from landing to auth pages

### Changed
- Unified page-level color language across landing, auth, listings, profile, messages, and admin
- Updated markdown documentation set to match current code contracts and architecture
- Updated docs to include admin auto-seeding behavior and env overrides

### Fixed
- Inconsistent text contrast across pages using mixed utility colors
- Stale docs claiming polling-only chat and no admin console

## 1.5.0 - Realtime Messaging + Admin Console (2026-04-20)

### Added
- Socket.IO realtime messaging pipeline
- Typing indicators, read acknowledgements, and presence updates
- Admin API and Admin Console page for user/listing moderation
- Default admin auto-seeding on backend startup

### Changed
- Messages UI to realtime-first with API fallback behavior
- Route protection extended with role-based admin gate

## 1.4.0 - Messaging Upgrade and Documentation Refresh (2026-04-12)

### Added
- Conversation/thread message endpoints
- Read-state tracking (`isRead`, `readAt`)
- Conversation grouping by `other user + post`

### Changed
- Messages page rewritten to conversation/thread split view
- API service expanded with thread/reply helper methods

### Fixed
- Message route visibility issues after stale process restarts
- Upload path handling edge cases in frontend rendering

## 1.3.0 - UX and Form Behavior Improvements (2026-04-11)

### Changed
- Floating label behavior aligned across input components
- Auth page branding consistency improvements

## 1.2.0 - Stability and API Hardening (2026-04-10)

### Changed
- Backend startup diagnostics improved
- MongoDB connection retry behavior refined

## 1.1.0 - Core Feature Completion (2026-04-10)

### Added
- Authentication flow
- Post CRUD with image uploads
- Search/filter listing feed
- Initial messaging endpoints

## 1.0.0 - Initial MVP Baseline (2026-04-09)

### Added
- Initial MERN scaffold
- Core models, routes, controllers, and base UI pages

## Upcoming

- Automated test suite (frontend + backend)
- Optional websocket fallback tuning and presence UX enhancements
- Moderation audit logs and reporting workflows
