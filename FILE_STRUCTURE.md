# File Structure

This map documents the current repository layout and ownership boundaries.

## Root

- README.md - project overview and release checklist
- SETUP.md - environment and deployment setup
- FEATURES.md - product behavior reference
- FILE_STRUCTURE.md - architecture and ownership map
- QUICK_REFERENCE.md - command and endpoint cheat sheet
- VERSION.md - release history
- DESIGN_SYSTEM_REFERENCE.md - UI token and interaction guide

## Backend: backend/

### Entry and config
- server.js - express bootstrap, middleware wiring, route mounts, health route
- config/db.js - MongoDB connection and startup diagnostics
- package.json - backend scripts/dependencies

### Models
- models/User.js - account data and password hashing hook
- models/Post.js - lost/found entity storage
- models/Message.js - message records with read state

### Middleware
- middleware/authMiddleware.js - JWT verification and user injection
- middleware/uploadMiddleware.js - image upload validation/storage

### Controllers
- controllers/authController.js - register, login, profile
- controllers/postController.js - post CRUD and ownership checks
- controllers/messageController.js - send, inbox, sent, conversations, thread, reply, read status

### Routes
- routes/authRoutes.js - /api/auth/*
- routes/postRoutes.js - /api/posts/*
- routes/messageRoutes.js - /api/messages/*

### Storage
- uploads/ - uploaded post images

## Frontend: frontend/

### Entry and config
- index.html - app shell and metadata
- src/main.jsx - React entry
- src/App.jsx - route tree and shared shells
- package.json - frontend scripts/dependencies

### API and state
- src/services/api.js - axios instance and API wrappers
- src/context/AuthContext.jsx - session state and auth helpers
- src/routes/ProtectedRoute.jsx - auth gate for private routes

### Pages
- src/pages/Home.jsx - discovery/search feed
- src/pages/PostDetail.jsx - item details and contact owner action
- src/pages/CreatePost.jsx - item creation form
- src/pages/EditPost.jsx - item editing form
- src/pages/Dashboard.jsx - user-owned post management
- src/pages/Messages.jsx - two-panel conversation and thread UI
- src/pages/Login.jsx - sign-in
- src/pages/Register.jsx - sign-up

### Components
- src/components/Navbar.jsx - global navigation
- src/components/PostCard.jsx - feed card renderer
- src/components/SearchBar.jsx - search and filters
- src/components/MessageBox.jsx - post-detail contact widget
- src/components/FloatingLabelInput.jsx - shared form input component
- src/components/Skeleton.jsx - loading placeholders
- src/components/PageWrapper.jsx - page transition wrapper
- src/components/ConfirmModal.jsx - destructive action confirmation

### Styling
- src/index.css - design tokens, component utilities, animations

## Ownership Boundaries

To keep changes safe and maintainable:

- Auth logic changes: backend/auth* and frontend/AuthContext + ProtectedRoute
- Post logic changes: backend/post* and frontend post pages/components
- Messaging logic changes: backend/message* and frontend Messages/MessageBox/api wrappers
- Design updates: frontend/src/index.css and component-level class usage

## Production Notes

- Keep secrets in environment variables only.
- Avoid storing generated assets in git except required static files.
- Route changes must be mirrored in frontend service wrappers.
- Any API contract update must be reflected in README and QUICK_REFERENCE.
