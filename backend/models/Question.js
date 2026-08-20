const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    companies: [{ type: String, index: true, trim: true }],
    topics: [{ type: String, index: true, trim: true }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, index: true },
    link: { type: String, trim: true },
    frequency: { type: Number, default: 0 },
    starterCode: {
      java: { type: String, default: '' },
    },
    testCases: [
      {
        input: { type: String, default: '' },
        expectedOutput: { type: String, default: '' },
        isSample: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

questionSchema.index({ title: 'text', companies: 'text', topics: 'text' });

module.exports = mongoose.model('Question', questionSchema);
