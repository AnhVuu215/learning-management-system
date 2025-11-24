const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');
const attemptService = require('../services/attempt.service');
const roles = require('../constants/roles');

const submitAttempt = asyncHandler(async (req, res) => {
  const result = await attemptService.submitAttempt({
    quizId: req.params.quizId,
    userId: req.user.id,
    answers: req.body.answers,
    durationSeconds: req.body.durationSeconds,
  });
  return res.status(201).json(new ApiResponse(201, 'Attempt recorded', result));
});

const myAttempts = asyncHandler(async (req, res) => {
  const attempts = await attemptService.listAttemptsForUser(req.user.id);
  return res.status(200).json(new ApiResponse(200, 'Attempts fetched', attempts));
});

const quizAttempts = asyncHandler(async (req, res) => {
  if (![roles.ADMIN, roles.INSTRUCTOR].includes(req.user.role)) {
    throw new ApiError(403, 'Forbidden');
  }
  const attempts = await attemptService.listAttemptsForQuiz(req.params.quizId);
  return res.status(200).json(new ApiResponse(200, 'Quiz attempts fetched', attempts));
});

module.exports = {
  submitAttempt,
  myAttempts,
  quizAttempts,
};

