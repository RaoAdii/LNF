const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const buildAuthPayload = (user, token) => ({
  success: true,
  token,
  user: {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    flatNumber: user.flatNumber,
    block: user.block,
    avatar: user.avatar,
    isVerified: user.isVerified,
    lastLoginAt: user.lastLoginAt,
    loginCount: user.loginCount,
  },
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  try {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name: String(name || '').trim(),
      email: normalizedEmail,
      password,
      role: 'user',
      isVerified: true,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      ...buildAuthPayload(user, token),
      message: 'Account created successfully.',
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Account suspended.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const now = new Date();
    const loginIp = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '')
      .split(',')[0]
      .trim();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          isVerified: true,
          lastLoginAt: now,
          lastLoginIp: loginIp,
        },
        $inc: { loginCount: 1 },
      },
      { new: true }
    );

    const token = generateToken(updatedUser._id, updatedUser.role);

    return res.status(200).json({
      ...buildAuthPayload(updatedUser, token),
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, flatNumber, block } = req.body;
    const updates = {};

    if (name) updates.name = String(name).trim();
    if (phone) updates.phone = String(phone).trim();
    if (flatNumber) updates.flatNumber = String(flatNumber).trim();
    if (block) updates.block = String(block).trim();
    if (req.file) updates.avatar = req.file.filename;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        flatNumber: user.flatNumber,
        block: user.block,
        avatar: user.avatar,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
