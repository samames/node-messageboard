const mongoose = require('mongoose');
const slug = require('slugs');
const crypto = require('crypto');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: { type: String, required: true, trim: true },
  slug: {
    type: String,
    unique: true,
  },
});

boardSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'board',
});

boardSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slug(this.title);
  }
  next();
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
