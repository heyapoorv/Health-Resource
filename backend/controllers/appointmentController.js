const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const filter = req.user.role === 'user' ? { user_id: req.user.id } : {};
    const appointments = await Appointment.find(filter)
      .populate('user_id', 'name email')
      .populate('location_id')
      .populate('offering_id');
    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment canceled' });
  } catch (err) {
    next(err);
  }
};
