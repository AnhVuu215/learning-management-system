const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const roles = require('../constants/roles');

const router = express.Router();

router.get('/', authenticate, authorizeRoles(roles.ADMIN), userController.listUsers);
router.get('/:id', authenticate, authorizeRoles(roles.ADMIN, roles.INSTRUCTOR), userController.getUser);
router.put('/me', authenticate, userController.updateProfile);

module.exports = router;

