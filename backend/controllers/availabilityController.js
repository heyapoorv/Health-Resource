const Availability = require('../models/Availability');

exports.addAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.create(req.body);
    res.status(201).json({ success: true, availability });
  } catch (err) {
    next(err);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {
    const { location_id } = req.query;
    const filter = location_id ? { location_id } : {};
    const availability = await Availability.find(filter).populate('location_id');
    res.json({ success: true, availability });
  } catch (err) {
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, availability });
  } catch (err) {
    next(err);
  }
};

exports.deleteAvailability = async (req, res, next) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Availability deleted' });
  } catch (err) {
    next(err);
  }
};
