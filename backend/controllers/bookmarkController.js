const Bookmark = require('../models/Bookmark');

// @desc   Get logged-in user's bookmarks
// @route  GET /api/bookmarks
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate('question');
    res.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (err) {
    next(err);
  }
};

// @desc   Add a bookmark
// @route  POST /api/bookmarks/:questionId
const addBookmark = async (req, res, next) => {
  try {
    const existing = await Bookmark.findOne({ user: req.user._id, question: req.params.questionId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already bookmarked' });
    }
    const bookmark = await Bookmark.create({ user: req.user._id, question: req.params.questionId });
    res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};

// @desc   Remove a bookmark
// @route  DELETE /api/bookmarks/:questionId
const removeBookmark = async (req, res, next) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user._id, question: req.params.questionId });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark };
