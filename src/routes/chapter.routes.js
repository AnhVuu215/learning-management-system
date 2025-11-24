const express = require('express');
const { body, param } = require('express-validator');
const chapterController = require('../controllers/chapter.controller');
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
    body('course').notEmpty().withMessage('course is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('description').optional().isString(),
  ],
  validateRequest,
  chapterController.createChapter
);

router.get('/course/:courseId', [param('courseId').notEmpty()], validateRequest, chapterController.listChapters);

router.put(
  '/:id',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  body('title').optional().isString(),
  validateRequest,
  chapterController.updateChapter
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  chapterController.deleteChapter
);

module.exports = router;

