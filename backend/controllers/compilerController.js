const Question = require('../models/Question');
const User = require('../models/User');
const { runCode, formatResult } = require('../utils/judge0');

// @desc   Run Java code with custom stdin (no verdict, just output)
// @route  POST /api/compiler/run
const runCustom = async (req, res, next) => {
  try {
    const { code, input } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const raw = await runCode(code, input || '');
    res.json({ success: true, data: formatResult(raw) });
  } catch (err) {
    if (err.response) {
      return res.status(502).json({
        success: false,
        message: 'Compiler service error. Please try again in a moment.',
      });
    }
    next(err);
  }
};

// @desc   Submit Java code against a question's test cases
// @route  POST /api/compiler/submit/:questionId
const submitSolution = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (!question.testCases || question.testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This question doesn't have test cases configured yet. Ask an admin to add some.",
      });
    }

    let passedCount = 0;
    let firstFailure = null;

    for (let i = 0; i < question.testCases.length; i++) {
      const tc = question.testCases[i];
      const raw = await runCode(code, tc.input || '', tc.expectedOutput || '');
      const formatted = formatResult(raw);
      const passed = formatted.status === 'Accepted';

      if (passed) {
        passedCount += 1;
      } else if (!firstFailure) {
        firstFailure = {
          index: i + 1,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: formatted.stdout.trim(),
          stderr: formatted.stderr || formatted.compileOutput || '',
          status: formatted.status,
        };
      }
    }

    const totalCount = question.testCases.length;
    const verdict = passedCount === totalCount ? 'Accepted' : 'Wrong Answer';

    // Auto mark as solved on full accept
    if (verdict === 'Accepted') {
      const user = await User.findById(req.user._id);
      if (!user.solvedQuestions.some((id) => id.toString() === question._id.toString())) {
        user.solvedQuestions.push(question._id);
        await user.save();
      }
    }

    res.json({
      success: true,
      data: { verdict, passedCount, totalCount, firstFailure },
    });
  } catch (err) {
    if (err.response) {
      return res.status(502).json({
        success: false,
        message: 'Compiler service error. Please try again in a moment.',
      });
    }
    next(err);
  }
};

module.exports = { runCustom, submitSolution };
