const mongoose = require('mongoose');


const AppointmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  offering_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceOffering', required: true },
  appointment_date: { type: Date, required: true },
  appointment_time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

AppointmentSchema.index(
  { offering_id: 1, appointment_date: 1, appointment_time: 1 },
  { unique: true }
);

AppointmentSchema.pre(/^find/, function(next) {
  this.populate('user_id', 'name email')
      .populate('location_id', 'name address')
      .populate('offering_id', 'name');
  next();
});


module.exports = mongoose.model('Appointment', AppointmentSchema);
