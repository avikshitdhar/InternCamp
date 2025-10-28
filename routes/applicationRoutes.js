const express = require('express');
const router = express.Router();
// const applicationController = require('../controllers/applications.controller');
// const { authenticate } = require('../middleware/auth.middleware');
// const { authorizeRoles } = require('../middleware/role.middleware');

// Student routes
router.post('/', authenticate, authorizeRoles('student'), applicationController.createApplication);
router.put('/:applicationId/withdraw', authenticate, authorizeRoles('student'), applicationController.withdrawApplication);
router.get('/student/:studentId', authenticate, authorizeRoles('student', 'admin'), applicationController.getApplicationsByStudent);

// Company/Admin routes
router.get('/', authenticate, authorizeRoles('company', 'admin'), applicationController.getApplications);
router.get('/:id', authenticate, applicationController.getApplicationById);
router.put('/:applicationId/status', authenticate, authorizeRoles('company', 'admin'), applicationController.updateApplicationStatus);
router.delete('/:id', authenticate, authorizeRoles('admin'), applicationController.deleteApplication);
router.get('/posting/:postingId', authenticate, authorizeRoles('company', 'admin'), applicationController.getApplicationsByPosting);
router.get('/posting/:postingId/shortlisted', authenticate, authorizeRoles('company', 'admin'), applicationController.getShortlistedStudents);

module.exports = router;
