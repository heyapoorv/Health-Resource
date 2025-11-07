const express = require('express');
const { createService, getServices, getServiceById, updateService, deleteService } = require('../controllers/medicalServiceController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['provider', 'admin']), createService);
router.get('/', getServices); // Public
router.get('/:id', getServiceById); // Public
router.put('/:id', authMiddleware(['provider', 'admin']), updateService);
router.delete('/:id', authMiddleware(['admin']), deleteService);

module.exports = router;
