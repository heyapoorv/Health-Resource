const mongoose = require('mongoose');

const ServiceOfferingSchema = new mongoose.Schema({
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('ServiceOffering', ServiceOfferingSchema);
