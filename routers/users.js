const express = require('express');
const router = new express.Router();
const userController = require('../controllers/users');
const auth = require('../middleware/auth');
const multer = require('multer');

router.put('/users/password-reset/:token', userController.resetPassword);

router.post('/users', userController.createUser);

router.get('/users/:id/avatar', userController.getAvatar);

router.get('/users/:id/:token', userController.verifyEmail);

router.post('/users/forgot', userController.forgotPassword);

router.post('/users/login', userController.loginUser);

router.post('/users/logout', auth, userController.logout);

router.post('/users/logoutall', auth, userController.logoutAll);

router.get('/users/me', auth, userController.getMyProfile);

router.get('/users/:id', auth, userController.getProfile);

router.patch('/users/me', auth, userController.updateUser);

router.post('/users/follow', auth, userController.followUser);

router.patch('/users/unfollow', auth, userController.removeFollowUser);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  userController.avatar
);

router.delete('/users/me/avatar', auth, userController.deleteAvatar);

module.exports = router;
