const express = require('express');
const { body } = require('express-validator');
const enrollmentController = require('../controllers/enrollment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const roles = require('../constants/roles');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles(roles.STUDENT, roles.ADMIN, roles.INSTRUCTOR),
  [body('course').notEmpty()],
  validateRequest,
  enrollmentController.enroll
);

router.get('/', authenticate, enrollmentController.listEnrollments);

router.patch(
  '/:id/progress',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  [body('progress').isFloat({ min: 0, max: 100 })],
  validateRequest,
  enrollmentController.updateProgress
);

module.exports = router;

