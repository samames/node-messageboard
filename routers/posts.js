const express = require('express');
const router = new express.Router();
const postController = require('../controllers/posts');
const auth = require('../middleware/auth');

router.post('/board/:board/post/', auth, postController.createPost);

router.get('/board/:board/posts', postController.readPosts);

router.get('/posts/:id', postController.readPost);

router.get('/my/posts', auth, postController.readMyPosts);

router.patch('/posts/:id', auth, postController.updatePost);

router.delete('/posts/:id', auth, postController.deletePost);

router.post('/posts/:id/comment', auth, postController.addComment);

router.delete('/posts/:id/:comment_id', auth, postController.deleteComment);

router.post('/search', postController.search);

router.patch('/comments', auth, postController.readComments);

router.get('/followed', auth, postController.followedPosts);

module.exports = router;
