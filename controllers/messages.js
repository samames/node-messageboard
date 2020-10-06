const User = require('../models/User');
const Message = require('../models/Message');
const { connectedUsers } = require('../utils/connectedUsers');

exports.createMessage = async (req, res) => {
  try {
    const recipient = await User.findOne({ slug: req.params.slug });

    if (!recipient) {
      return res.status(400).send();
    }
    const message = new Message({
      recipient: recipient._id,
      author: req.user._id,
      ...req.body,
    });
    recipient.unreadMessages = true;
    await recipient.save();
    await message.save();

    if (connectedUsers[recipient.name]) {
      // const id = connectedUsers[recipient.name].id;
      // req.app.io.to(id).emit('mailNotification');
      connectedUsers[recipient.name].emit('mailNotification');
    }

    res.status(201).send(message);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.unnotifyMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.unreadMessages = false;
    await user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.readMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();

    res.send(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.readMessage = async (req, res) => {
  try {
    const message = await Message.find({
      recipient: req.user._id,
      slug: req.params.slug,
    })
      .populate('author')
      .exec();

    if (!message) {
      return res.status(404).send();
    }
    res.send(message);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
