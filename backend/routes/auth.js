const express = require('express');
const { register, login, getProfile, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware(), getProfile);
router.post('/logout', authMiddleware(), logout); // Add authMiddleware if needed

module.exports = router;
