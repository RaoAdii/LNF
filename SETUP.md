# Installation & Running Instructions

## Quick Start Guide

### Step 1: Clone or Extract the Project
```bash
cd LNF
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure .env file with your MongoDB URI
# Edit .env and update:
# MONGO_URI=your_mongodb_atlas_connection_string
# JWT_SECRET=your_secret_key

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Environment Configuration

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-found-hub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Get MongoDB URI from:
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from "Connect" button

## Testing the Application

1. **Register** a new account at `http://localhost:5173/register`
2. **Login** with your credentials at `http://localhost:5173/login`
3. **Create a Post** at `/create-post`
4. **Browse Posts** on home page
5. **Search & Filter** posts
6. **View Post Details** by clicking on any post card
7. **Send Messages** to other users about posts
8. **Check Messages** in the Messages section

## Features to Try

- ✅ User Registration & Login
- ✅ Create Lost/Found Posts with Images
- ✅ Edit and Delete Your Posts
- ✅ Search Posts by Keyword
- ✅ Filter by Type (Lost/Found) and Category
- ✅ Upload Images (JPG, PNG, WebP, max 5MB)
- ✅ Send Messages to Post Owners
- ✅ View Inbox & Sent Messages
- ✅ Mark Posts as Resolved
- ✅ Protected Dashboard for authenticated users

## Default API Endpoints

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/profile

Posts:
  GET    /api/posts
  GET    /api/posts/:id
  GET    /api/posts/my-posts
  POST   /api/posts
  PUT    /api/posts/:id
  DELETE /api/posts/:id

Messages:
  POST   /api/messages
  GET    /api/messages/inbox
  GET    /api/messages/sent
```

## Common Issues

### "Cannot POST /api/auth/register"
- Make sure backend is running on port 5000
- Check CORS configuration in server.js

### "MONGO_URI is not defined"
- Create .env file in backend folder
- Add MONGO_URI=your_connection_string

### "API call failed"
- Check if both frontend and backend are running
- Verify port numbers (5000 for backend, 5173 for frontend)

### "Image upload not working"
- Ensure uploads folder exists in backend
- Check file size < 5MB
- Verify MIME type is image

## Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder - ready to deploy
```

### Backend
```bash
# Use PM2 or Docker for production
npm install -g pm2
pm2 start server.js --name "lost-found-hub"
```

---
That's it! The application is now ready to use. 🎉
