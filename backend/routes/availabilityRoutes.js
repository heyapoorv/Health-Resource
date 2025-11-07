const express = require('express');
const { addAvailability, getAvailability, updateAvailability, deleteAvailability } = require('../controllers/availabilityController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['provider', 'admin']), addAvailability);
router.get('/', getAvailability); // Public
router.put('/:id', authMiddleware(['provider', 'admin']), updateAvailability);
router.delete('/:id', authMiddleware(['admin']), deleteAvailability);

module.exports = router;
