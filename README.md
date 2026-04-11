# Lost & Found Hub for Housing Societies

A complete, production-ready MERN web application where housing society residents can post lost or found items with images, search posts, and message other residents securely.

## Features

✅ **User Authentication** - JWT-based registration and login with secure password hashing
✅ **Post Management** - Full CRUD operations for lost/found items
✅ **Image Upload** - Upload and display images with Multer
✅ **Search & Filter** - Filter by keyword, type (lost/found), and category
✅ **Messaging System** - Secure peer-to-peer messaging between residents about specific posts
✅ **Responsive UI** - Mobile-friendly design with Tailwind CSS
✅ **Error Handling** - Comprehensive error handling on both frontend and backend
✅ **Loading States** - User-friendly loading indicators
✅ **Toast Notifications** - Real-time feedback on all actions

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Request validation

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Formik + Yup** - Form validation
- **React Toastify** - Notifications

## Folder Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   └── messageController.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Message.js
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   └── messageRoutes.js
├── uploads/
├── .env
├── server.js
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── MessageBox.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreatePost.jsx
│   │   ├── EditPost.jsx
│   │   ├── PostDetail.jsx
│   │   └── Messages.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── index.html
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Edit `.env` file and add:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-found-hub?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **In a new terminal, navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Routes (`/api/auth`)

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Profile (Protected)**
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Post Routes (`/api/posts`)

**Get All Posts**
```
GET /api/posts
GET /api/posts?q=search_keyword
GET /api/posts?type=lost
GET /api/posts?type=found
GET /api/posts?category=Keys
```

**Get Single Post**
```
GET /api/posts/:id
```

**Get My Posts (Protected)**
```
GET /api/posts/my-posts
Authorization: Bearer <token>
```

**Create Post (Protected)**
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "type": "lost",
  "title": "Lost Black Wallet",
  "description": "Lost near parking area",
  "location": "Block C",
  "category": "Wallet",
  "image": <file>
}
```

**Update Post (Protected)**
```
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "type": "lost",
  "title": "Updated Title",
  "description": "Updated description",
  "location": "Updated location",
  "category": "Wallet",
  "status": "resolved",
  "image": <file> (optional)
}
```

**Delete Post (Protected)**
```
DELETE /api/posts/:id
Authorization: Bearer <token>
```

### Message Routes (`/api/messages`)

**Send Message (Protected)**
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user_id",
  "postId": "post_id",
  "messageText": "I found your wallet!"
}
```

**Get Inbox (Protected)**
```
GET /api/messages/inbox
Authorization: Bearer <token>
```

**Get Sent Messages (Protected)**
```
GET /api/messages/sent
Authorization: Bearer <token>
```

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Post
```javascript
{
  type: String (lost/found),
  title: String,
  description: String,
  imageUrl: String,
  location: String,
  category: String (Keys, Wallet, Pet, Phone, Documents, Other),
  status: String (open/resolved),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Message
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  postId: ObjectId (ref: Post),
  messageText: String,
  createdAt: Date
}
```

## Authentication Flow

1. User registers/logs in
2. Password is hashed with bcryptjs
3. JWT token is generated and returned
4. Token is stored in localStorage on frontend
5. Axios interceptor automatically adds token to all requests
6. Backend validates token with authMiddleware
7. Token expiration triggers automatic logout

## File Upload Configuration

- **Storage:** Local disk storage (`/backend/uploads/`)
- **Allowed formats:** JPEG, JPG, PNG, WebP
- **Max size:** 5MB
- **Field name:** image
- **Served from:** `http://localhost:5000/uploads/`

## Key Features Explained

### Search & Filter
- Search by keyword (title, description, location)
- Filter by type (lost/found)
- Filter by category
- Combine multiple filters

### Protected Routes
- Only authenticated users can access dashboard, create posts, edit posts, and messages
- Unauthenticated users are redirected to login

### Image Preview
- Users can preview images before uploading
- Images are served from backend's uploads folder
- Fallback placeholder for missing images

### Real-time Notifications
- Toast notifications for all actions
- Success, error, and info messages
- Auto-dismiss after 3 seconds

## Running in Production

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2: `pm2 start server.js`
3. Use a reverse proxy like Nginx
4. Enable CORS for your frontend domain

### Frontend
1. Build for production: `npm run build`
2. Output will be in `dist/` folder
3. Deploy to Vercel, Netlify, or any static hosting

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB Atlas IP whitelist includes your machine IP
- Check credentials in MONGO_URI
- Enable network access in MongoDB Atlas

### Port Already in Use
- Backend (5000): `lsof -i :5000` then `kill -9 <PID>`
- Frontend (5173): `lsof -i :5173` then `kill -9 <PID>`

### CORS Errors
- Ensure backend has CORS enabled for `http://localhost:5173`
- Check API base URL in frontend `services/api.js`

### Image Upload Issues
- Ensure backend has write permissions to `/uploads` folder
- Check file size doesn't exceed 5MB
- Verify MIME type is supported

## Security Considerations

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens have expiration
- ✅ Protected routes require authentication
- ✅ File upload is validated
- ✅ CORS is restricted to localhost:5173
- ✅ Environment variables for sensitive data

## Future Enhancements

- Social media sharing
- Email notifications
- Advanced analytics dashboard
- Mobile app with React Native
- Real-time notifications with Socket.io
- User reviews/ratings
- Better image compression
- Payment integration for premium features

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue on GitHub or contact the development team.

---

**Happy using Lost & Found Hub! 🔍**
