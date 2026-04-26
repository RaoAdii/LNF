const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  getStats,
  getAllUsers,
  getAllPosts,
  deletePost,
  updatePostFlags,
  toggleBanUser,
  toggleAdminRole,
  deleteUser,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.patch('/posts/:id', updatePostFlags);
router.delete('/posts/:id', deletePost);
router.patch('/users/:id/ban', toggleBanUser);
router.patch('/users/:id/promote', toggleAdminRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
