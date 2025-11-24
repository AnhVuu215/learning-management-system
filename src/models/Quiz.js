const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [optionSchema], validate: [(val) => val.length >= 2, 'At least two options required'] },
    correctOption: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    title: { type: String, required: true },
    shuffleQuestions: { type: Boolean, default: true },
    timeLimitMinutes: { type: Number, default: 0 },
    attemptsAllowed: { type: Number, default: 0 }, // 0 = unlimited
    passingScore: { type: Number, default: 70 },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);

