const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', postController.getAllPosts);

router.get('/my-posts', authMiddleware, postController.getMyPosts);

router.get('/:id', postController.getPostById);

router.post(
  '/',
  authMiddleware,
  uploadMiddleware.single('image'),
  [
    body('type', 'Type must be either "lost" or "found"')
      .isIn(['lost', 'found']),
    body('title', 'Title is required').notEmpty().trim(),
    body('description', 'Description is required').notEmpty().trim(),
    body('location', 'Location is required').notEmpty().trim(),
    body('category', 'Category is required').isIn([
      'Keys',
      'Wallet',
      'Pet',
      'Phone',
      'Documents',
      'Other',
    ]),
  ],
  postController.createPost
);

router.put(
  '/:id',
  authMiddleware,
  uploadMiddleware.single('image'),
  [
    body('type').optional().isIn(['lost', 'found']),
    body('title').optional().notEmpty().trim(),
    body('description').optional().notEmpty().trim(),
    body('location').optional().notEmpty().trim(),
    body('category')
      .optional()
      .isIn(['Keys', 'Wallet', 'Pet', 'Phone', 'Documents', 'Other']),
    body('status').optional().isIn(['open', 'resolved']),
  ],
  postController.updatePost
);

router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
