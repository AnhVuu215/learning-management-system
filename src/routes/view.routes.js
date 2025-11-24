const express = require('express');
const viewController = require('../controllers/view.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', viewController.renderHome);
router.get('/dashboard', authenticate, viewController.renderDashboard);

module.exports = router;

