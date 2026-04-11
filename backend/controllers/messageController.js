const Message = require('../models/Message');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { receiverId, postId, messageText } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Cannot message yourself
    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = new Message({
      senderId: req.user.id,
      receiverId,
      postId,
      messageText,
    });

    await message.save();
    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');
    await message.populate('postId', 'title');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.user.id })
      .populate('senderId', 'name email')
      .populate('postId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Inbox messages retrieved successfully',
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.user.id })
      .populate('receiverId', 'name email')
      .populate('postId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Sent messages retrieved successfully',
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
