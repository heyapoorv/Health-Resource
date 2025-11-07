const express = require('express');
const { createLocation, getLocations, updateLocation, deleteLocation } = require('../controllers/locationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['provider', 'admin']), createLocation);
router.get('/', getLocations); // Public
router.put('/:id', authMiddleware(['provider', 'admin']), updateLocation);
router.delete('/:id', authMiddleware(['admin']), deleteLocation);

module.exports = router;
