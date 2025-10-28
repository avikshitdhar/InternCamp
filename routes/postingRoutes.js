const express = require('express');
const router = express.Router();
// const postingController = require('../controllers/postings.controller');
// const { authenticate } = require('../middleware/auth.middleware');
// const { authorizeRoles } = require('../middleware/role.middleware');
// const { validatePosting } = require('../middleware/validate.middleware');

// Company or Admin only
router.post('/', authenticate, authorizeRoles('company', 'admin'), validatePosting, postingController.createPosting);
router.get('/', authenticate, postingController.getPostings);
router.get('/filter', authenticate, postingController.filterPostings);
router.get('/:id', authenticate, postingController.getPostingById);
router.put('/:id', authenticate, authorizeRoles('company', 'admin'), postingController.updatePosting);
router.delete('/:id', authenticate, authorizeRoles('company', 'admin'), postingController.deletePosting);

// Extras
router.get('/company/:userId', authenticate, authorizeRoles('company', 'admin'), postingController.getPostingsByCompany);
router.put('/:postingId/extend', authenticate, authorizeRoles('company', 'admin'), postingController.extendDeadline);
router.put('/:postingId/archive', authenticate, authorizeRoles('company', 'admin'), postingController.archivePosting);

module.exports = router;
