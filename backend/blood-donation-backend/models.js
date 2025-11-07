// models.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { nanoid } = require('nanoid'); // install: npm i nanoid

// ===== Resource Schema =====
const resourceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["bloodbank", "hospital", "medical"], required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat] for geospatial queries
  }
}, { timestamps: true });

// Create 2dsphere index for geolocation queries
resourceSchema.index({ location: "2dsphere" });
resourceSchema.index({ type: 1 });

// ===== Booking Schema =====
const bookingSchema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, index: true }, // for quick lookup
  email: { type: String, trim: true },
  age: { type: Number, min: 0 },
  bloodGroup: { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"], required: true },
  requirement: { type: String, enum: ["donate","request","emergency"], required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  date: Date,
  time: String,
  location: {
    lat: Number,
    lng: Number
  },
  referenceId: { type: String, default: () => nanoid(10), unique: true },
}, { timestamps: true });

// Index referenceId for faster lookup
bookingSchema.index({ referenceId: 1 });

// ===== Models =====
const Resource = mongoose.model('Resource', resourceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Resource, Booking };
