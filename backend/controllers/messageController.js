const Message = require('../models/Message');
const Post = require('../models/Post');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id));

const createAndPopulateMessage = async ({ senderId, receiverId, postId, messageText }) => {
  if (!isValidObjectId(receiverId) || !isValidObjectId(postId)) {
    return { error: { status: 400, message: 'Invalid receiver or post id' } };
  }

  const normalizedMessage = String(messageText || '').trim();
  if (!normalizedMessage) {
    return { error: { status: 400, message: 'Message text is required' } };
  }

  const post = await Post.findById(postId);
  if (!post) {
    return { error: { status: 404, message: 'Post not found' } };
  }

  if (String(receiverId) === String(senderId)) {
    return { error: { status: 400, message: 'Cannot send message to yourself' } };
  }

  const message = new Message({
    senderId,
    receiverId,
    postId,
    messageText: normalizedMessage,
  });

  await message.save();
  await message.populate('senderId', 'name email');
  await message.populate('receiverId', 'name email');
  await message.populate('postId', 'title type');

  return { message };
};

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { receiverId, postId, messageText } = req.body;
    const { message, error } = await createAndPopulateMessage({
      senderId: req.user.id,
      receiverId,
      postId,
      messageText,
    });

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

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
      .populate('postId', 'title type')
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
      .populate('postId', 'title type')
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

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('postId', 'title type')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      if (!msg.senderId || !msg.receiverId || !msg.postId) {
        return;
      }

      const isSentByMe = String(msg.senderId._id) === String(userId);
      const otherUser = isSentByMe ? msg.receiverId : msg.senderId;
      const key = `${String(otherUser._id)}_${String(msg.postId._id)}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
          },
          postId: {
            _id: msg.postId._id,
            title: msg.postId.title,
            type: msg.postId.type,
          },
          lastMessage: {
            messageText: msg.messageText,
            createdAt: msg.createdAt,
            senderId: msg.senderId._id,
          },
          unreadCount: 0,
          messages: [],
        });
      }

      if (!isSentByMe && !msg.isRead) {
        const current = conversationsMap.get(key);
        current.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.status(200).json({
      message: 'Conversations retrieved successfully',
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getThread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId, postId } = req.params;

    if (!isValidObjectId(otherUserId) || !isValidObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid thread parameters' });
    }

    await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        postId,
        isRead: false,
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    const threadMessages = await Message.find({
      postId,
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: 'Thread retrieved successfully',
      count: threadMessages.length,
      data: threadMessages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.replyMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { receiverId, postId, messageText } = req.body;
    const { message, error } = await createAndPopulateMessage({
      senderId: req.user.id,
      receiverId,
      postId,
      messageText,
    });

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(201).json({
      message: 'Reply sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId, postId } = req.params;

    if (!isValidObjectId(otherUserId) || !isValidObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid thread parameters' });
    }

    const result = await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        postId,
        isRead: false,
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({
      message: 'Thread marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
