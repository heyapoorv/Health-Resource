const MedicineRequest = require('../models/MedicineRequest');

exports.createRequest = async (req, res, next) => {
  try {
    const request = await MedicineRequest.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const filter = req.user.role === 'user' ? { user_id: req.user.id } : {};
    const requests = await MedicineRequest.find(filter).populate('user_id').populate('service_id');
    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const request = await MedicineRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};
