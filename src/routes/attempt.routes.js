const express = require('express');
const { body } = require('express-validator');
const attemptController = require('../controllers/attempt.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/quiz/:quizId',
  authenticate,
  [body('answers').isArray({ min: 1 })],
  validateRequest,
  attemptController.submitAttempt
);

router.get('/me', authenticate, attemptController.myAttempts);
router.get('/quiz/:quizId', authenticate, attemptController.quizAttempts);

module.exports = router;

