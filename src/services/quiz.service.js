const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/ApiError');

const ensureLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }
  return lesson;
};

const sanitizeQuiz = (quiz) => {
  const plain = quiz.toObject();
  plain.questions = plain.questions.map(({ _id, prompt, options }) => ({
    _id,
    prompt,
    options,
  }));
  return plain;
};

const createQuiz = async (payload) => {
  const lesson = await ensureLesson(payload.lesson);
  const quiz = await Quiz.create(payload);
  lesson.quiz = quiz._id;
  await lesson.save();
  return quiz;
};

const updateQuiz = async (id, payload) => {
  const quiz = await Quiz.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  return quiz;
};

const getQuiz = async (id, options = { includeAnswers: false, shuffle: true }) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  if (options.includeAnswers) {
    return quiz;
  }

  let questions = quiz.questions;
  if (quiz.shuffleQuestions && options.shuffle) {
    questions = [...quiz.questions].sort(() => Math.random() - 0.5);
  }

  return {
    ...sanitizeQuiz(quiz),
    questions: questions.map((q) => ({
      _id: q._id,
      prompt: q.prompt,
      options: q.options,
    })),
  };
};

const listQuizzesByLesson = async (lessonId) => Quiz.find({ lesson: lessonId });

const deleteQuiz = async (id) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  await Lesson.findOneAndUpdate({ quiz: quiz._id }, { $unset: { quiz: '' } });
  await quiz.deleteOne();
};

module.exports = {
  createQuiz,
  updateQuiz,
  getQuiz,
  listQuizzesByLesson,
  deleteQuiz,
};

