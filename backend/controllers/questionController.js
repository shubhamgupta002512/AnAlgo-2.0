const Question = require('../models/Question');

// @desc   Get all questions with filters: company, topic, difficulty, search, pagination
// @route  GET /api/questions
const getQuestions = async (req, res, next) => {
  try {
    const { company, topic, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (company) filter.companies = { $regex: new RegExp(`^${company}$`, 'i') };
    if (topic) filter.topics = { $regex: new RegExp(`^${topic}$`, 'i') };
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(filter).sort({ frequency: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Question.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: questions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single question
// @route  GET /api/questions/:id
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

// @desc   Create question (admin)
// @route  POST /api/questions
const createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

// @desc   Update question (admin)
// @route  PUT /api/questions/:id
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete question (admin)
// @route  DELETE /api/questions/:id
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc   Get distinct list of companies and topics (for filter dropdowns)
// @route  GET /api/questions/meta/filters
const getFilterMeta = async (req, res, next) => {
  try {
    const companies = await Question.distinct('companies');
    const topics = await Question.distinct('topics');
    res.json({ success: true, data: { companies: companies.sort(), topics: topics.sort() } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getFilterMeta,
};
