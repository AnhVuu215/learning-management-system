const AttemptHistory = require('../models/AttemptHistory');
const Quiz = require('../models/Quiz');
const ApiError = require('../utils/ApiError');

const countAttempts = (quizId, userId) => AttemptHistory.countDocuments({ quiz: quizId, user: userId });

const submitAttempt = async ({ quizId, userId, answers = [], durationSeconds = 0 }) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  if (quiz.attemptsAllowed > 0) {
    const attemptsCount = await countAttempts(quizId, userId);
    if (attemptsCount >= quiz.attemptsAllowed) {
      throw new ApiError(403, 'Maximum attempts reached');
    }
  }

  const questionMap = new Map();
  quiz.questions.forEach((question) => questionMap.set(String(question._id), question));

  let correctCount = 0;
  const gradedAnswers = answers.map((answer) => {
    const question = questionMap.get(String(answer.questionId));
    if (!question) {
      throw new ApiError(400, 'Invalid question reference');
    }
    const isCorrect = Number(answer.selectedOption) === question.correctOption;
    if (isCorrect) {
      correctCount += 1;
    }
    return {
      questionId: question._id,
      selectedOption: Number(answer.selectedOption),
      isCorrect,
    };
  });

  const total = quiz.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= quiz.passingScore;

  const attempt = await AttemptHistory.create({
    quiz: quizId,
    user: userId,
    answers: gradedAnswers,
    score,
    correctCount,
    totalQuestions: total,
    durationSeconds,
    passed,
  });

  return { attempt, score, passed, correctCount, totalQuestions: total };
};

const listAttemptsForUser = async (userId) =>
  AttemptHistory.find({ user: userId }).populate({
    path: 'quiz',
    select: 'title lesson',
    populate: { path: 'lesson', select: 'title chapter' },
  });

const listAttemptsForQuiz = async (quizId) =>
  AttemptHistory.find({ quiz: quizId })
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 });

module.exports = {
  submitAttempt,
  listAttemptsForUser,
  listAttemptsForQuiz,
};

