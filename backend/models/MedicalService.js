const mongoose = require('mongoose');

const MedicalServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['hospital', 'clinic', 'blood_bank', 'pharmacy'], required: true,default:'hospital' },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String }
});

module.exports = mongoose.model('MedicalService', MedicalServiceSchema);
