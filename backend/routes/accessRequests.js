const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createRequest,
  listRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/accessRequestController');

const router = express.Router();

router.post('/', authenticate, authorize('USER'), createRequest);
router.get('/', authenticate, listRequests);
router.patch('/:id/approve', authenticate, authorize('ADMIN'), approveRequest);
router.patch('/:id/reject', authenticate, authorize('ADMIN'), rejectRequest);

module.exports = router;
