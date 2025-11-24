const express = require('express');
const { body } = require('express-validator');
const assignmentController = require('../controllers/assignment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const roles = require('../constants/roles');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(authenticate, assignmentController.listAssignments)
  .post(
    authenticate,
    authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
    [body('course').notEmpty(), body('title').notEmpty(), body('description').notEmpty(), body('dueDate').isISO8601()],
    validateRequest,
    assignmentController.createAssignment
  );

router
  .route('/:id')
  .put(authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), assignmentController.updateAssignment)
  .delete(authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), assignmentController.deleteAssignment);

router.post(
  '/submissions',
  authenticate,
  authorizeRoles(roles.STUDENT, roles.ADMIN, roles.INSTRUCTOR),
  [body('assignment').notEmpty(), body('content').notEmpty()],
  validateRequest,
  assignmentController.submitWork
);

router.get('/submissions/list', authenticate, assignmentController.listSubmissions);

router.patch(
  '/submissions/:id',
  authenticate,
  authorizeRoles(roles.ADMIN, roles.INSTRUCTOR),
  assignmentController.gradeSubmission
);

module.exports = router;

