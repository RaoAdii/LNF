const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const dbUser = await User.findById(decoded.id).select('isBanned role').lean();
    if (!dbUser) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }
    if (dbUser.isBanned) {
      return res.status(403).json({ success: false, message: 'Account suspended.' });
    }

    req.user.role = dbUser.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = authMiddleware;
