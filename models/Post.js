const mongoose = require('mongoose');
const slug = require('slugs');
const crypto = require('crypto');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
    },
    comments: [
      {
        comment: {
          type: String,
          required: true,
          trim: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    board: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slug(`${this.title}-${crypto.randomBytes(2).toString('hex')}`);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
