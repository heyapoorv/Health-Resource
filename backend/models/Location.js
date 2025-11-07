const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalService', required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip_code: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
});

module.exports = mongoose.model('Location', LocationSchema);
