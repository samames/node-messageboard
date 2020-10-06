const mongoose = require('mongoose');
const slug = require('slugs');
const crypto = require('crypto');

const messageSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

messageSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slug(`${this.title}-${crypto.randomBytes(2).toString('hex')}`);
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
