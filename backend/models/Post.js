const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if this is a lost or found post'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  imageUrl: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  category: {
    type: String,
    enum: ['Keys', 'Wallet', 'Pet', 'Phone', 'Documents', 'Other'],
    required: [true, 'Please select a category'],
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.index({ createdAt: -1, type: 1, category: 1, status: 1 });
PostSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Post', PostSchema);
