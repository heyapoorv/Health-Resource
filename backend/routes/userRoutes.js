const express = require('express');
const { getAllUsers, getUserById, updateProfile, deleteUser, register } = require('../controllers/userController'); // ✅ Added register
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware'); // ✅ Added validateRequest

const { body } = require('express-validator');
const router = express.Router();

// Register User (with validation)
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest, // ✅ Ensures validation errors are handled
  register
);

// Admin Routes
router.get('/', authMiddleware(['admin']), getAllUsers);
router.get('/:id', authMiddleware(['admin']), getUserById);

// User Routes
router.put('/profile', authMiddleware(), updateProfile);  
router.delete('/:id', authMiddleware(['admin']), deleteUser);

module.exports = router;
