const express = require('express');
const router = express.Router();
const { runCustom, submitSolution } = require('../controllers/compilerController');
const { protect } = require('../middleware/auth');

router.post('/run', protect, runCustom);
router.post('/submit/:questionId', protect, submitSolution);

module.exports = router;
