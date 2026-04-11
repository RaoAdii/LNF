# Complete Feature Guide - Lost & Found Hub

## User Authentication

### Registration
- Visit `/register` page
- Fill in: Name, Email, Password, Confirm Password
- Form validates input (min 6 char password)
- On success: redirected to home, token saved to localStorage
- On error: toast notification shows error message

### Login
- Visit `/login` page
- Enter Email and Password
- On success: redirected to home, token saved to localStorage
- JWT token automatically attached to all API requests
- Logout: removes token from localStorage

### Protected Routes
- `/my-posts` - Dashboard with user's posts
- `/create-post` - Form to create new post
- `/messages` - Inbox and sent messages
- Unauthenticated users redirected to login

---

## Post Management

### Create Post
- Navigate to "Post Item" button (only visible when logged in)
- Fill form with:
  - **Type**: Lost or Found
  - **Title**: Item name/description
  - **Description**: Detailed info (min 10 characters)
  - **Location**: Where it was lost/found
  - **Category**: Keys, Wallet, Pet, Phone, Documents, Other
  - **Image**: Upload photo (max 5MB, JPG/PNG/WebP)
- Preview image before submitting
- On success: redirected to dashboard

### View Posts

**Home Page**
- See all posts in grid format
- Posts show:
  - Image (or placeholder)
  - Lost/Found badge (red/green)
  - Category badge (blue)
  - Title, location, date
  - Resolved status (if applicable)
- Click post card to view full details

### Search & Filter
- **Keyword Search**: Find by title, description, or location
- **Type Filter**: Show only Lost or Found items
- **Category Filter**: Show specific category
- **Clear Filters**: Reset and show all posts
- Filters work in combination

### View Post Details
- Shows full image, title, description
- Displays owner name and email
- Shows location and date posted
- Contact Owner button (if not owner and logged in)
- For owners: Edit and Delete options
- Status badge (open/resolved)

### Edit Post
- Only post owner can edit
- Navigate to dashboard "My Posts"
- Click "Edit" on any post
- Update any fields
- Re-upload image (optional)
- Submit changes

### Delete Post
- Only post owner can delete
- Navigate to dashboard
- Click "Delete" button
- Confirm deletion
- Post permanently removed

### Mark as Resolved
- Navigate to dashboard "My Posts"
- Click "Resolved" button
- Post status changes to "Resolved"
- Resolved posts show checkmark badge
- Can still edit or delete

---

## Dashboard (My Posts)

- View all posts you've created
- See post images, titles, locations
- Quick actions:
  - **View**: See full post details
  - **Edit**: Modify post information
  - **Resolved**: Mark item as found/recovered
  - **Delete**: Remove post
- Shows post status (open/resolved)

---

## Messaging System

### Send Message
- Navigate to any post (public page)
- If not owner: click "Contact Owner" button
- MessageBox opens with form
- Type your message
- Submit message
- Toast confirms delivery

### View Inbox
- Navigate to Messages page (only when logged in)
- Click "Inbox" tab
- See all messages you received
- Shows:
  - Sender name
  - Post title the message refers to
  - Message content
  - Date and time received
  - Sender email

### View Sent Messages
- In Messages page, click "Sent" tab
- See all messages you've sent
- Shows:
  - Recipient name
  - Post title
  - Message content
  - Date and time sent
  - Recipient email

### Message Format
- Each message is linked to a specific post
- Timestamp shows when message was sent
- Sender/receiver info visible
- Full message text displayed

---

## Search Examples

### Find Lost Items
1. Go to Home page
2. Filter Type: "Lost"
3. OR search "lost keys" in keywords

### Find Specific Category
1. Go to Home page
2. Select Category: "Pet"
3. View all lost/found pets

### Search by Location
1. Go to Home page
2. Search keywords: "Block C"
3. View items lost/found near that location

### Combined Search
1. Type: Lost
2. Category: Wallet
3. Keyword: "near parking"
4. See lost wallets near parking

---

## Image Upload

### Requirements
- Format: JPG, JPEG, PNG, WebP
- Size: Maximum 5 MB
- Recommended: 300x300px or larger

### Upload Process
1. Click "Upload Image" in post form
2. Select image from device
3. Preview shows before submission
4. Image stored in /backend/uploads/
5. Served with timestamp to prevent caching

### Troubleshooting
- File too large? Compress before upload
- Wrong format? Convert to JPG/PNG
- Upload fails? Check backend is running

---

## Error Handling

### Common Errors & Solutions

**"No token provided, authorization denied"**
- Not logged in or token expired
- Go to login page and re-login

**"Token is invalid"**
- Token corrupted or tampered with
- Clear localStorage and login again

**"Post not found"**
- Post was deleted
- Go back and refresh post list

**"Not authorized"**
- Trying to edit/delete someone else's post
- Only owners can modify their posts

**"File size exceeds limit"**
- Image > 5MB
- Compress image and retry

**"Only image files allowed"**
- Wrong file type selected
- Use JPG, PNG, or WebP format

---

## Browser Storage

The app uses localStorage to persist:
- **token**: JWT authentication token (7 days)
- **user**: Logged-in user info (name, email, ID)

Clear localStorage to:
- Force logout
- Reset authentication
- Fix token issues

---

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- 200: OK (successful GET, PUT)
- 201: Created (successful POST)
- 400: Bad Request (validation error)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not authorized)
- 404: Not Found (resource doesn't exist)
- 500: Server Error

---

## Best Practices

### When Creating Posts
✓ Be detailed in description
✓ Upload clear, bright image
✓ Include specific location details
✓ Mention unique identifying features
✓ Use appropriate category

### When Sending Messages
✓ Be polite and professional
✓ Include your contact info in message
✓ Ask clarifying questions if needed
✓ Follow up on conversations

### Security
✓ Don't share password
✓ Logout after use
✓ Use strong passwords
✓ Update email regularly
✓ Report suspicious activity

---

## Performance Tips

- Images load faster with compression
- Search results update in real-time
- Filtering is instant with no page reload
- Lazy loading for post cards
- Cached API responses reduce server load

---

## Mobile Experience

- Fully responsive design
- Touch-friendly buttons
- Mobile-optimized layout
- Works on all screen sizes
- Optimized images for mobile

---

Need help? 
- Check this guide for feature details
- Review README.md for setup
- Check console (F12) for error messages
- Ensure backend is running on port 5000
