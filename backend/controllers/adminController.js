const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');

const DEFAULT_ADMIN_EMAIL = 'admin@lnf.local';
const normalizeEmail = (value) => String(value || '').toLowerCase().trim();
const resolveDefaultAdminEmail = () =>
  normalizeEmail(process.env.ADMIN_TEST_EMAIL || DEFAULT_ADMIN_EMAIL);

exports.getStats = async (_req, res, next) => {
  try {
    const [totalUsers, totalPosts, openPosts, resolvedPosts, totalMessages] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: 'open' }),
      Post.countDocuments({ status: 'resolved' }),
      Message.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalPosts, openPosts, resolvedPosts, totalMessages },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    const defaultAdminEmail = resolveDefaultAdminEmail();
    const enrichedUsers = users.map((entry) => ({
      ...entry,
      isDefaultAdmin: normalizeEmail(entry.email) === defaultAdminEmail,
    }));

    res.json({
      success: true,
      users: enrichedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('createdBy', 'name email flatNumber block')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.updatePostFlags = async (req, res, next) => {
  try {
    const { type, status } = req.body || {};
    const updates = {};

    if (type !== undefined) {
      if (!['lost', 'found'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type must be lost or found.' });
      }
      updates.type = type;
    }

    if (status !== undefined) {
      if (!['open', 'resolved'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be open or resolved.' });
      }
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one valid field to update (type or status).',
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email flatNumber block')
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    return res.json({
      success: true,
      post,
      message: 'Post flags updated successfully.',
    });
  } catch (err) {
    return next(err);
  }
};

exports.toggleBanUser = async (req, res, next) => {
  try {
    const [user, actingUser] = await Promise.all([
      User.findById(req.params.id).select('-password'),
      User.findById(req.user?.id).select('email role').lean(),
    ]);

    const defaultAdminEmail = resolveDefaultAdminEmail();
    const isTargetDefaultAdmin = normalizeEmail(user?.email) === defaultAdminEmail;
    const isActingDefaultAdmin = normalizeEmail(actingUser?.email) === defaultAdminEmail;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (isTargetDefaultAdmin && !isActingDefaultAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the default admin can manage default admin ban status.',
      });
    }

    if (isTargetDefaultAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Default admin account cannot be banned.',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot ban another admin.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      user,
      message: user.isBanned ? 'User banned.' : 'User unbanned.',
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleAdminRole = async (req, res, next) => {
  try {
    const [user, actingUser] = await Promise.all([
      User.findById(req.params.id).select('-password'),
      User.findById(req.user?.id).select('email role').lean(),
    ]);

    const defaultAdminEmail = resolveDefaultAdminEmail();
    const isTargetDefaultAdmin = normalizeEmail(user?.email) === defaultAdminEmail;
    const isActingDefaultAdmin = normalizeEmail(actingUser?.email) === defaultAdminEmail;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (isTargetDefaultAdmin && !isActingDefaultAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the default admin can manage the default admin role.',
      });
    }

    if (isTargetDefaultAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Default admin role cannot be changed.',
      });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.json({
      success: true,
      user,
      message: `Role set to ${user.role}.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const targetUserId = String(req.params.id || '');
    const actingUserId = String(req.user?.id || '');

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'User id is required.' });
    }

    if (targetUserId === actingUserId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(targetUserId).select('role email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete another admin account.' });
    }

    const userPostIds = await Post.find({ createdBy: targetUserId }).distinct('_id');
    const messageFilters = [{ senderId: targetUserId }, { receiverId: targetUserId }];

    if (userPostIds.length > 0) {
      messageFilters.push({ postId: { $in: userPostIds } });
    }

    const [deletedMessagesResult, deletedPostsResult, deletedUserResult] = await Promise.all([
      Message.deleteMany({ $or: messageFilters }),
      Post.deleteMany({ createdBy: targetUserId }),
      User.deleteOne({ _id: targetUserId }),
    ]);

    if (deletedUserResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: 'User and related data deleted permanently.',
      cleanup: {
        postsDeleted: deletedPostsResult.deletedCount || 0,
        messagesDeleted: deletedMessagesResult.deletedCount || 0,
      },
    });
  } catch (err) {
    return next(err);
  }
};
