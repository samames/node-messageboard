const Board = require('../models/Board');
const User = require('../models/User');
const Post = require('../models/Post');

exports.createBoard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.superUser === false) {
      return res.status(401).send('you are not authorised!');
    }
    const board = new Board(req.body);
    await board.save();
    res.status(201).send(board);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find();

    const promises = boards.map(async (boardI) => {
      const posts = await Post.find({ board: boardI.slug });
      const post = await Post.findOne({ board: boardI.slug })
        .sort({ field: 'asc', _id: -1 })
        .limit(1)
        .populate('author')
        .exec();
      if (post !== null) {
        post.populate('author').execPopulate();
        if (!post.author) {
          return {
            _id: boardI._id,
            title: boardI.title,
            description: boardI.description,
            slug: boardI.slug,
            numOfPosts: posts.length,
            latestTitle: post.title,
            latestSlug: post.slug,
            latestDate: post.createdAt,
          };
        }
        return {
          _id: boardI._id,
          title: boardI.title,
          description: boardI.description,
          slug: boardI.slug,
          numOfPosts: posts.length,
          latestTitle: post.title,
          latestSlug: post.slug,  
          latestDate: post.createdAt,
          latestAuthor: post.author.name,
          latestAuthorId: post.author.slug,
        };
      } else {
        return {
          _id: boardI._id,
          title: boardI.title,
          description: boardI.description,
          slug: boardI.slug,
        };
      }
    });
    const postCount = await Promise.all(promises);
    res.send(postCount);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ slug: req.params.id });
    if (!board) {
      return res.status(404);
    }
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};

exports.updateBoard = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'title'];
  const validOp = updates.every((update) => allowedUpdates.includes(update));
  if (!validOp) {
    return res.status(400).send({ error: 'invalid updates' });
  }

  try {
    const board = await Board.findOne({ slug: req.params.id });
    if (!board) {
      return res.status(404).send();
    }

    updates.forEach((update) => (board[update] = req.body[update]));
    board.save();

    res.send(board);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = Board.findOne({ slug: req.params.id });
    if (!board) {
      return res.status(404).send();
    }
    await board.deleteOne();
    res.send('board deleted');
  } catch (err) {
    res.status(400).send(err.message);
  }
};
