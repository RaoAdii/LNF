# File Structure

This map documents the active repository layout and ownership boundaries.

## Root

- `README.md` - project overview
- `SETUP.md` - setup and deployment steps
- `FEATURES.md` - functional behavior reference
- `FILE_STRUCTURE.md` - architecture map
- `QUICK_REFERENCE.md` - fast command/API cheatsheet
- `DESIGN_SYSTEM_REFERENCE.md` - visual and interaction standards
- `VERSION.md` - changelog
- `docs/screenshots/` - README UI screenshots

## Backend (`backend/`)

### Entry & Config
- `server.js` - Express app, HTTP server, Socket.IO, middleware, route mounting
- `config/db.js` - MongoDB connection + retry behavior
- `config/cloudinary.js` - Cloudinary config helper (optional)

### Models
- `models/User.js`
- `models/Post.js`
- `models/Message.js`

### Controllers
- `controllers/authController.js`
- `controllers/postController.js`
- `controllers/messageController.js`
- `controllers/adminController.js`

### Routes
- `routes/authRoutes.js` -> `/api/auth/*`
- `routes/postRoutes.js` -> `/api/posts/*`
- `routes/messageRoutes.js` -> `/api/messages/*`
- `routes/adminRoutes.js` -> `/api/admin/*`

### Middleware
- `middleware/authMiddleware.js`
- `middleware/adminMiddleware.js`
- `middleware/uploadMiddleware.js`

### Supporting Services/Utils
- `services/emailService.js` - SMTP helper
- `utils/otpHelper.js` - OTP helper utilities
- `utils/seedAdminUser.js` - default admin seeding logic

### Runtime Storage
- `uploads/` - uploaded assets (`posts`, `avatars`)

## Frontend (`frontend/`)

### Core App
- `src/main.jsx` - React entry point
- `src/App.jsx` - router, lazy routes, navbar orchestration
- `src/index.css` - global tokens, utilities, animations

### Context & Routes
- `src/context/AuthContext.jsx`
- `src/routes/ProtectedRoute.jsx`

### API & Realtime
- `src/services/api.js` - axios instance + API wrappers
- `src/services/socket.js` - socket connection lifecycle

### Pages
- `src/pages/Landing.jsx`
- `src/pages/Home.jsx`
- `src/pages/PostDetail.jsx`
- `src/pages/CreatePost.jsx`
- `src/pages/EditPost.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Messages.jsx`
- `src/pages/Profile.jsx`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/NotFound.jsx`
- `src/pages/admin/AdminPanel.jsx`

### Components
- `src/components/Navbar.jsx`
- `src/components/BrandLogo.jsx`
- `src/components/DotGrid.jsx`
- `src/components/DotGrid.css`
- `src/components/ColorBends.jsx`
- `src/components/PostCard.jsx`
- `src/components/SearchBar.jsx`
- `src/components/MessageBox.jsx`
- `src/components/FloatingLabelInput.jsx`
- `src/components/Skeleton.jsx`
- `src/components/PageWrapper.jsx`
- `src/components/ConfirmModal.jsx`

### Tooling
- `vite.config.js` - Vite config + `@components` alias
- `tailwind.config.js`
- `postcss.config.js`

## Ownership Boundaries

- Auth logic: backend auth controller/routes + frontend AuthContext/ProtectedRoute/login/register/profile
- Listings logic: backend post controller/routes + frontend home/create/edit/detail/dashboard
- Messaging logic: backend message controller/routes + frontend MessageBox/Messages/socket/api wrappers
- Admin logic: backend admin controller/routes + frontend admin panel
- Design system: `frontend/src/index.css` and reusable UI components

## Change Safety Rules

- Keep API route changes synced with `frontend/src/services/api.js`.
- Keep socket event contract changes synced with `frontend/src/services/socket.js` and `Messages.jsx`.
- If global tokens/classes change, re-check all major pages for contrast and legibility.
- Update markdown docs after contract or architecture changes.
