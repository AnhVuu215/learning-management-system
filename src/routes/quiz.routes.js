const express = require('express');
const { body } = require('express-validator');
const quizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const roles = require('../constants/roles');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  [
    body('lesson').notEmpty(),
    body('title').notEmpty(),
    body('questions').isArray({ min: 1 }),
    body('questions.*.prompt').notEmpty(),
    body('questions.*.options').isArray({ min: 2 }),
    body('questions.*.correctOption').isInt(),
  ],
  validateRequest,
  quizController.createQuiz
);

router.get('/:id', authenticate, quizController.getQuiz);
router.put('/:id', authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), quizController.updateQuiz);
router.delete('/:id', authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), quizController.deleteQuiz);
router.get('/lesson/:lessonId', authenticate, quizController.listQuizzes);

module.exports = router;

