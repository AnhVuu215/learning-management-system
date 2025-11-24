const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password requires at least 6 characters'),
    body('role').optional().isString(),
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  authController.login
);

router.post(
  '/logout',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validateRequest,
  authenticate,
  authController.logout
);

router.post(
  '/refresh-token',
  [body('refreshToken').notEmpty()],
  validateRequest,
  authController.refreshToken
);

router.post(
  '/forgot-password',
  [body('email').isEmail()],
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 6 })],
  validateRequest,
  authController.resetPassword
);

router.get('/me', authenticate, authController.getProfile);
router.put(
  '/me',
  authenticate,
  [body('fullName').optional().isString(), body('bio').optional().isString()],
  validateRequest,
  authController.updateProfile
);

router.patch(
  '/change-password',
  authenticate,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  authController.changePassword
);

module.exports = router;

