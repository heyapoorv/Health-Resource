const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  day_of_week: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], required: true }], // Array of days
  open_time: { type: String },
  close_time: { type: String }
});


module.exports = mongoose.model('Availability', AvailabilitySchema);
