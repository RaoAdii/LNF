const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getAllPosts = async (req, res) => {
  try {
    let query = {};

    // Search by keyword
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Filter by type (lost/found)
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    const posts = await Post.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Posts retrieved successfully',
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('getAllPosts error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post retrieved successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { type, title, description, location, category } = req.body;

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "lost" or "found"' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

    const post = new Post({
      type,
      title,
      description,
      imageUrl,
      location,
      category,
      createdBy: req.user.id,
    });

    await post.save();
    await post.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { type, title, description, location, category, status } = req.body;

    if (type) {
      if (!['lost', 'found'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either "lost" or "found"' });
      }
      post.type = type;
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (location) post.location = location;
    if (category) post.category = category;
    if (status) {
      if (!['open', 'resolved'].includes(status)) {
        return res.status(400).json({ message: 'Status must be either "open" or "resolved"' });
      }
      post.status = status;
    }

    if (req.file) {
      post.imageUrl = req.file.path;
    }

    await post.save();
    await post.populate('createdBy', 'name email');

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Your posts retrieved successfully',
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
