const MedicalService = require('../models/MedicalService');

exports.createService = async (req, res, next) => {
  try {
    const service = await MedicalService.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const services = await MedicalService.find(filter);
    res.json({ success: true, services });
  } catch (err) {
    next(err);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const service = await MedicalService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await MedicalService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    await MedicalService.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
};
