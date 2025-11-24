const express = require('express');
const { body } = require('express-validator');
const lessonController = require('../controllers/lesson.controller');
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
    body('chapter').notEmpty(),
    body('title').notEmpty(),
    body('summary').optional().isString(),
    body('videoUrl').optional().isString(),
    body('textContent').optional().isString(),
  ],
  validateRequest,
  lessonController.addLesson
);

router.get('/:courseId', lessonController.listLessons);

router
  .route('/detail/:id')
  .put(
    authenticate,
    authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
    [body('title').optional().isString()],
    validateRequest,
    lessonController.updateLesson
  )
  .delete(authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), lessonController.deleteLesson);

module.exports = router;

