const express = require('express');
const router = express.Router();
// const adminController = require('../controllers/user.admin.controller');
// const { authenticate } = require('../middleware/auth.middleware');
// const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticate, authorizeRoles('admin'), adminController.createAdmin);
router.get('/', authenticate, authorizeRoles('admin'), adminController.getAdmins);
router.get('/:id', authenticate, authorizeRoles('admin'), adminController.getAdminById);
router.put('/:id', authenticate, authorizeRoles('admin'), adminController.updateAdmin);
router.delete('/:id', authenticate, authorizeRoles('admin'), adminController.deleteAdmin);

module.exports = router;
