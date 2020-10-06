const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const boardController = require('../controllers/boards');

router.post('/boards', auth, boardController.createBoard);

router.get('/boards', boardController.getBoards);

router.get('/boards/:id', boardController.getBoard);

router.patch('/boards/:id', auth, boardController.updateBoard);

router.delete('/boards/:id', auth, boardController.deleteBoard);

module.exports = router;
