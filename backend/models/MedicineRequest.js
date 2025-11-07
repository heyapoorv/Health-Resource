const mongoose = require('mongoose');

const MedicineRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalService', required: true },
  medicine_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['requested', 'approved', 'denied', 'ready_for_pickup'], default: 'requested' },
  requested_at: { type: Date, default: Date.now }
});

MedicineRequestSchema.index({ user_id: 1 });
MedicineRequestSchema.index({ service_id: 1 });
MedicineRequestSchema.index({ status: 1 });


module.exports = mongoose.model('MedicineRequest', MedicineRequestSchema);
