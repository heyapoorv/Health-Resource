const express = require('express');
const { register, login, getProfile,logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware(), getProfile); // Protected
router.post('/register', register);      // Public
router.post('/login', login);            // Public
router.get('/profile', authMiddleware(), getProfile); // Protected
router.post('/logout', authMiddleware(), logout);



module.exports = router;
