const express = require('express');
const { createOffering, getOfferings, updateOffering, deleteOffering } = require('../controllers/serviceOfferingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['provider', 'admin']), createOffering);
router.get('/', getOfferings); // Public
router.put('/:id', authMiddleware(['provider', 'admin']), updateOffering);
router.delete('/:id', authMiddleware(['admin']), deleteOffering);

module.exports = router;
