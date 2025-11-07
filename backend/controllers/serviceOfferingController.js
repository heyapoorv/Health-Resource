const ServiceOffering = require('../models/ServiceOffering');

exports.createOffering = async (req, res, next) => {
  try {
    const offering = await ServiceOffering.create(req.body);
    res.status(201).json({ success: true, offering });
  } catch (err) {
    next(err);
  }
};

exports.getOfferings = async (req, res, next) => {
  try {
    const { location_id } = req.query;
    const filter = location_id ? { location_id } : {};
    const offerings = await ServiceOffering.find(filter).populate('location_id');
    res.json({ success: true, offerings });
  } catch (err) {
    next(err);
  }
};

exports.updateOffering = async (req, res, next) => {
  try {
    const offering = await ServiceOffering.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, offering });
  } catch (err) {
    next(err);
  }
};

exports.deleteOffering = async (req, res, next) => {
  try {
    await ServiceOffering.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offering deleted' });
  } catch (err) {
    next(err);
  }
};
