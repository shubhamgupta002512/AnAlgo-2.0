const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register new user
// @route  POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get logged-in user profile
// @route  GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('solvedQuestions', 'title difficulty topics companies');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc   Mark a question as solved / unsolved (toggle)
// @route  PUT /api/auth/solved/:questionId
const toggleSolved = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { questionId } = req.params;
    const index = user.solvedQuestions.findIndex((q) => q.toString() === questionId);

    if (index > -1) {
      user.solvedQuestions.splice(index, 1);
    } else {
      user.solvedQuestions.push(questionId);
    }

    await user.save();
    res.json({ success: true, data: user.solvedQuestions });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe, toggleSolved };
