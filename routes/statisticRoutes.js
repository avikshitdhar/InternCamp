const express = require('express');
const router = express.Router();
// const statisticsController = require('../controllers/statistics.controller');
// const { authenticate } = require('../middleware/auth.middleware');
// const { authorizeRoles } = require('../middleware/role.middleware');

// // Admin-only statistics endpoints
// router.get('/overview', authenticate, authorizeRoles('admin'), statisticsController.getSystemStats);
// router.get('/company/:companyId', authenticate, authorizeRoles('admin', 'company'), statisticsController.getCompanyStats);
// router.get('/department/:department', authenticate, authorizeRoles('admin'), statisticsController.getDepartmentStats);

module.exports = router;
