const express = require('express');
const { bookAppointment, getAppointments, updateAppointmentStatus, cancelAppointment } = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware(['user']), bookAppointment);
router.get('/', authMiddleware(['user', 'provider', 'admin']), getAppointments);
router.put('/:id/status', authMiddleware(['provider', 'admin']), updateAppointmentStatus);
router.delete('/:id', authMiddleware(['user', 'admin']), cancelAppointment);

module.exports = router;
