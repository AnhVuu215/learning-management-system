const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const quizService = require('../services/quiz.service');

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  return res.status(201).json(new ApiResponse(201, 'Quiz created', quiz));
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Quiz updated', quiz));
});

const getQuiz = asyncHandler(async (req, res) => {
  const includeAnswers = req.user?.role === 'admin' || req.user?.role === 'instructor';
  const quiz = await quizService.getQuiz(req.params.id, { includeAnswers, shuffle: !includeAnswers });
  return res.status(200).json(new ApiResponse(200, 'Quiz fetched', quiz));
});

const listQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await quizService.listQuizzesByLesson(req.params.lessonId);
  return res.status(200).json(new ApiResponse(200, 'Quizzes fetched', quizzes));
});

const deleteQuiz = asyncHandler(async (req, res) => {
  await quizService.deleteQuiz(req.params.id);
  return res.status(204).send();
});

module.exports = {
  createQuiz,
  updateQuiz,
  getQuiz,
  listQuizzes,
  deleteQuiz,
};

