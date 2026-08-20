const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getFilterMeta,
} = require('../controllers/questionController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getQuestions);
router.get('/meta/filters', getFilterMeta);
router.get('/:id', getQuestionById);
router.post('/', protect, admin, createQuestion);
router.put('/:id', protect, admin, updateQuestion);
router.delete('/:id', protect, admin, deleteQuestion);

module.exports = router;
