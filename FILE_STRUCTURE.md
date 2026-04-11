# File Structure & Purpose Guide

## Backend Files

### Configuration & Setup
- **`backend/package.json`** - Dependencies and scripts (node dependencies)
- **`backend/.env`** - Environment variables (MongoDB URI, JWT secret)
- **`backend/.env.example`** - Template for .env file
- **`backend/.gitignore`** - Files to ignore in git
- **`backend/server.js`** - Main server entry point, Express app setup

### Database
- **`backend/config/db.js`** - MongoDB connection configuration
- **`backend/models/User.js`** - User schema (name, email, hashed password)
- **`backend/models/Post.js`** - Post schema (lost/found item data)
- **`backend/models/Message.js`** - Message schema (user-to-user messages)

### Middleware
- **`backend/middleware/authMiddleware.js`** - JWT token verification for protected routes
- **`backend/middleware/uploadMiddleware.js`** - Multer configuration for image uploads

### Controllers (Business Logic)
- **`backend/controllers/authController.js`**
  - `register` - User registration with password hashing
  - `login` - User login with JWT generation
  - `getProfile` - Get authenticated user profile

- **`backend/controllers/postController.js`**
  - `getAllPosts` - Get posts with search/filter
  - `getPostById` - Get single post details
  - `getMyPosts` - Get user's posts
  - `createPost` - Create new post with image
  - `updatePost` - Update post (owner only)
  - `deletePost` - Delete post (owner only)

- **`backend/controllers/messageController.js`**
  - `sendMessage` - Send message about a post
  - `getInbox` - Get received messages
  - `getSentMessages` - Get sent messages

### Routes (API Endpoints)
- **`backend/routes/authRoutes.js`** - `/api/auth/*` endpoints
- **`backend/routes/postRoutes.js`** - `/api/posts/*` endpoints
- **`backend/routes/messageRoutes.js`** - `/api/messages/*` endpoints

### Storage
- **`backend/uploads/`** - Directory for uploaded images

---

## Frontend Files

### Configuration & Setup
- **`frontend/package.json`** - React dependencies and scripts
- **`frontend/.gitignore`** - Files to ignore in git
- **`frontend/index.html`** - HTML entry point
- **`frontend/vite.config.js`** - Vite configuration
- **`frontend/tailwind.config.js`** - Tailwind CSS configuration
- **`frontend/postcss.config.js`** - PostCSS configuration

### Styles
- **`frontend/src/index.css`** - Global styles and Tailwind setup

### Entry Point
- **`frontend/src/main.jsx`** - React app initialization
- **`frontend/src/App.jsx`** - Main app component with routing

### Services & Context
- **`frontend/src/services/api.js`**
  - Axios instance with interceptors
  - API calls for auth, posts, messages
  - JWT token attachment to requests
  - Token expiration handling

- **`frontend/src/context/AuthContext.jsx`**
  - Global authentication state
  - User, token, login/logout functions
  - localStorage sync

### Routes
- **`frontend/src/routes/ProtectedRoute.jsx`** - HOC for protected routes (requires login)

### Components (Reusable UI)
- **`frontend/src/components/Navbar.jsx`**
  - Navigation bar with links
  - Login/Register/Logout buttons
  - User name display
  - Responsive menu

- **`frontend/src/components/PostCard.jsx`**
  - Post preview card
  - Image, title, category, type badge
  - Created date and location
  - Link to post details

- **`frontend/src/components/SearchBar.jsx`**
  - Search by keyword
  - Filter by type (lost/found)
  - Filter by category
  - Clear filters button

- **`frontend/src/components/MessageBox.jsx`**
  - Modal for sending messages
  - Textarea for message input
  - Send/Cancel buttons
  - Toast notification feedback

### Pages (Full Page Views)

- **`frontend/src/pages/Home.jsx`**
  - Public home page
  - Post grid with cards
  - SearchBar component
  - Post list with filtering
  - Click post card → PostDetail

- **`frontend/src/pages/Register.jsx`**
  - User registration form
  - Formik + Yup validation
  - Password confirmation
  - Success → redirect to login
  - Link to login page

- **`frontend/src/pages/Login.jsx`**
  - User login form
  - Email and password fields
  - Formik + Yup validation
  - Success → save token → redirect home
  - Link to register page

- **`frontend/src/pages/Dashboard.jsx`**
  - User's personal posts
  - Grid of user's created posts
  - Edit, Delete, View, Mark Resolved buttons
  - Only accessible when logged in

- **`frontend/src/pages/CreatePost.jsx`**
  - Form to create new post
  - Type, Title, Description, Location, Category
  - Image upload with preview
  - Formik + Yup form validation
  - multipart/form-data submission
  - Only accessible when logged in

- **`frontend/src/pages/EditPost.jsx`**
  - Edit existing post (owner only)
  - Pre-filled form with current data
  - Change any field
  - Optional image replacement
  - Update → redirect to dashboard

- **`frontend/src/pages/PostDetail.jsx`**
  - Full post view
  - Large image display
  - Complete description
  - Owner information
  - Contact Owner button (if not owner)
  - Edit/Delete buttons (if owner)
  - Status badge (open/resolved)

- **`frontend/src/pages/Messages.jsx`**
  - Inbox and Sent tabs
  - List of messages
  - Sort by date (newest first)
  - Sender/Receiver info
  - Message content preview
  - Timestamp display
  - Only accessible when logged in

### Public Directory
- **`frontend/public/`** - Static assets

---

## Document Files

- **`README.md`** - Comprehensive project documentation
  - Features overview
  - Tech stack details
  - Setup instructions
  - API documentation
  - Database models
  - Troubleshooting guide

- **`SETUP.md`** - Quick start guide
  - Installation steps
  - Environment setup
  - Running the application
  - Testing the features
  - Build for production

- **`FEATURES.md`** - Detailed feature guide
  - How to use each feature
  - Step-by-step instructions
  - Search examples
  - Error handling
  - Best practices
  - Mobile experience
  - Performance tips

---

## File Statistics

### Backend
- Total Files: 15
- Controllers: 3
- Models: 3
- Middleware: 2
- Routes: 3
- Config: 1
- Main + npm: 5

### Frontend
- Total Files: 30+
- Components: 4
- Pages: 8
- Services: 1
- Context: 1
- Routes: 1
- Config + Styles: 6
- HTML + Entry: 2

### Documentation
- README.md (1600+ lines)
- SETUP.md (100+ lines)
- FEATURES.md (400+ lines)

---

## Key Patterns & Conventions

### Backend
- **MVC Pattern**: Models, Controllers, Routes
- **Middleware Stack**: Auth, Upload validation
- **Error Handling**: Try-catch in controllers
- **Status Codes**: Proper HTTP status for responses
- **Validation**: express-validator on routes

### Frontend
- **Component-Based**: Reusable components
- **Context API**: Global state management
- **Protected Routes**: HOC wrapper for auth
- **Form Validation**: Formik + Yup
- **API Service**: Centralized Axios instance
- **Error Handling**: Toast notifications

---

## Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "multer": "^1.4.5-lts.1",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "express-validator": "^7.0.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "axios": "^1.5.0",
  "react-toastify": "^9.1.3",
  "formik": "^2.4.5",
  "yup": "^1.2.0"
}
```

---

## How Everything Works Together

1. **User Registration**
   - Frontend form (Register.jsx) → API call (api.js) → Backend (authController) → Database

2. **Post Creation**
   - Frontend form (CreatePost.jsx) → Multipart data → uploadMiddleware → postController → Database + File system

3. **Viewing Posts**
   - Backend retrieves from DB → Frontend Grid (Home.jsx) → PostCard components

4. **Messaging**
   - Sender (MessageBox.jsx) → Backend (messageController) → Receiver views in Messages.jsx

5. **Protected Routes**
   - User logs in → Token saved → ProtectedRoute checks token → Page displayed/redirected

---

This modular structure ensures:
- ✅ Separation of concerns
- ✅ Easy maintenance
- ✅ Code scalability
- ✅ Testing capability
- ✅ Production ready
