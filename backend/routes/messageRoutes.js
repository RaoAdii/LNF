const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('receiverId', 'Receiver ID is required').notEmpty(),
    body('postId', 'Post ID is required').notEmpty(),
    body('messageText', 'Message text is required').notEmpty().trim(),
  ],
  messageController.sendMessage
);

router.get('/inbox', authMiddleware, messageController.getInbox);

router.get('/sent', authMiddleware, messageController.getSentMessages);

router.get('/conversations', authMiddleware, messageController.getConversations);

router.get('/thread/:otherUserId/:postId', authMiddleware, messageController.getThread);

router.post(
  '/reply',
  authMiddleware,
  [
    body('receiverId', 'Receiver ID is required').notEmpty(),
    body('postId', 'Post ID is required').notEmpty(),
    body('messageText', 'Message text is required').notEmpty().trim(),
  ],
  messageController.replyMessage
);

router.put('/read/:otherUserId/:postId', authMiddleware, messageController.markAsRead);

module.exports = router;
