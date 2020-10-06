const User = require('../models/User');
const sharp = require('sharp');
const { sendWelcomeEmail, sendResetEmail } = require('../utils/emailSIB');
const crypto = require('crypto');

exports.createUser = async (req, res) => {
  try {
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({ ...req.body, verify: emailVerificationToken });
    await user.save();
    sendWelcomeEmail(
      user.email,
      user.name,
      user._id,
      'localhost:5000',
      user.verify
    );
    res.status(201).send();
  } catch (err) {
    res.status(400);
    res.send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const validOp = updates.every((update) => allowedUpdates.includes(update));

  if (!validOp) {
    return res.status(400).send({ error: 'invalid updates' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (req.body.email && user.email !== req.body.email) {
      user.verify = crypto.randomBytes(20).toString('hex');
      await sendWelcomeEmail(
        req.body.email,
        user.name,
        user._id,
        'localhost:5000',
        user.verify
      );
    }
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.verify !== req.params.token) {
      throw new Error();
    }
    user.verify = undefined;
    await user.save();
    res.send('You may now log in.');
  } catch (err) {
    res.status(400).send();
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user.verify) {
      throw new Error();
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(401).send();
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send('A password reset token has been emailed to you.');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    sendResetEmail(user.email, user.name, user.resetPasswordToken);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error('Token is invalid or has expired.');
    }
    if (!req.body.password) {
      throw new Error('No new password provided.');
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getMyProfile = async (req, res) => {
  res.send(req.user);
};

exports.getProfile = async (req, res) => {
  try {
    const userProfile = await User.findOne({ slug: req.params.id });
    const user = await User.findById(req.user._id);

    const follow = user.follows.find(
      (follow) => follow.user.toString() === userProfile._id.toString()
    );
    let followed = false;

    if (follow) {
      followed = true;
    }

    res.send({ userProfile, followed });
  } catch (err) {
    console.error(err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
};

(exports.avatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}),
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  };

exports.deleteAvatar = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
};

exports.getAvatar = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.id });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const userFollow = await User.findById(req.body.follow);

    if (user._id.toString() === userFollow._id.toString()) {
      throw new Error('cannot follow self!');
    }

    if (!userFollow) {
      return res.status(500).send('no user with that ID');
    }
    user.follows.forEach((item) => {
      if (item.user.toString() === req.body.follow) {
        throw new Error('Duplicate follow');
      }
    });

    const newFollow = {
      user: userFollow._id,
    };
    user.follows.unshift(newFollow);

    user.save();
    res.send(user.follows);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.removeFollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const userFollow = await User.findById(req.body.unfollow);

    if (!userFollow) {
      return res.status(500).send('no user with that ID');
    }

    const follow = user.follows.find(
      (follow) => follow.user.toString() === req.body.unfollow
    );

    if (!follow) {
      throw new Error('cannot unfollow non-followed user!');
    }

    const removeIndex = user.follows.indexOf(follow);
    user.follows.splice(removeIndex, 1);

    user.save();
    res.send(user.follows);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
