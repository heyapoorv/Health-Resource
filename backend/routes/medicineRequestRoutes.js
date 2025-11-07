const express = require('express');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/medicineRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['user']), createRequest);
router.get('/', authMiddleware(['user', 'provider', 'admin']), getRequests);
router.put('/:id/status', authMiddleware(['provider', 'admin']), updateRequestStatus);

module.exports = router;
