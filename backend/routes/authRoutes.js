const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.login
);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
