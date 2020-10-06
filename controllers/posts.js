const Post = require('../models/Post');
const Board = require('../models/Board');
const User = require('../models/User');
const { connectedUsers } = require('../utils/connectedUsers');

exports.createPost = async (req, res) => {
  const board = await Board.findOne({ slug: req.params.board });
  if (!board) {
    return res.status(404).send();
  }
  const post = new Post({
    ...req.body,
    author: req.user._id,
    board: req.params.board,
  });

  try {
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.readPosts = async (req, res) => {
  try {
    const posts = await Post.find({ board: req.params.board })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();
    res.send(posts);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.readMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.populate('posts').execPopulate();
    res.send(user.posts);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.readPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.id });
    if (!post) {
      return res.status(404).send();
    }
    await post.populate('author').execPopulate();
    await post.populate('comments.user').execPopulate();
    res.send(post);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updatePost = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['content', 'title'];
  const validOp = updates.every((update) => allowedUpdates.includes(update));
  if (!validOp) {
    return res.status(400).send({ error: 'invalid updates' });
  }

  try {
    const post = await Post.findOne({
      slug: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      return res.status(404).send();
    }

    updates.forEach((update) => (post[update] = req.body[update]));
    post.save();

    res.send(post);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = Post.findOneAndDelete({
      slug: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      return res.status(404).send();
    }
    await post.deleteOne();
    res.send('post deleted');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.readComments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.unreadComments = false;
    await user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.id })
      .populate('author')
      .exec();
    const author = await User.findById(post.author);

    const newComment = {
      comment: req.body.comment,
      user: req.user._id,
    };

    post.comments.unshift(newComment);
    author.unreadComments = true;
    await post.save();
    await author.save();

    if (connectedUsers[author.name]) {
      // const id = connectedUsers[author.name].id;
      // req.app.io.to(id).emit('boardsNotification');
      connectedUsers[author.name].emit('boardsNotification');
    }

    res.json(post.comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.id });

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'comment not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'user not authorised' });
    }

    const removeIndex = post.comments.indexOf(comment);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};
exports.search = async (req, res) => {
  try {
    const posts = await Post.find({
      $text: { $search: req.body.searchTerm },
    })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();
    res.send({ count: posts.length, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};
exports.followedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const follows = [];
    for (const follow of user.follows) {
      follows.push(follow.user);
    }

    const posts = await Post.find({ author: { $in: follows } })
      .sort({ createdAt: 'desc' })
      .select('-comments')
      .populate('author')
      .limit(20)
      .exec();

    res.send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};
