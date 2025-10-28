const express = require('express');
const router = express.Router();
// const interviewController = require('../controllers/interview.controller');
// const { authenticate } = require('../middleware/auth.middleware');
// const { authorizeRoles } = require('../middleware/role.middleware');

// Company/Admin routes
router.post('/', authenticate, authorizeRoles('company', 'admin'), interviewController.createInterview);
router.get('/', authenticate, authorizeRoles('admin', 'company'), interviewController.getInterviews);
router.get('/company/:companyId', authenticate, authorizeRoles('company', 'admin'), interviewController.getInterviewsByCompany);
router.put('/:interviewId/status', authenticate, authorizeRoles('company', 'admin'), interviewController.updateInterviewStatus);

// Student routes
router.get('/student/:studentId', authenticate, authorizeRoles('student', 'admin'), interviewController.getInterviewsByStudent);
router.get('/:interviewId/test/:studentId', authenticate, authorizeRoles('student'), interviewController.getTestLink);

router.get('/:id', authenticate, interviewController.getInterviewById);
router.put('/:id', authenticate, authorizeRoles('company', 'admin'), interviewController.updateInterview);
router.delete('/:id', authenticate, authorizeRoles('admin'), interviewController.deleteInterview);

module.exports = router;
