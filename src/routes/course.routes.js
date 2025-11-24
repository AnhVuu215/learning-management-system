const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/course.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const roles = require('../constants/roles');
const validateRequest = require('../middlewares/validateRequest');
const { uploadSingleImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router
  .route('/')
  .get(courseController.listCourses)
  .post(
    authenticate,
    authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
    [body('title').notEmpty(), body('description').notEmpty()],
    validateRequest,
    uploadSingleImage('thumbnail'),
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(
    authenticate,
    authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
    uploadSingleImage('thumbnail'),
    courseController.updateCourse
  )
  .delete(authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), courseController.deleteCourse);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  [body('status').isIn(['draft', 'published', 'archived', 'locked'])],
  validateRequest,
  courseController.updateCourse
);

module.exports = router;

