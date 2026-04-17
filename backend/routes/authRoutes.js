const express = require('express');
const router = express.Router();
const { register, verifyOTP, login } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user and generate OTP
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/verify
// @desc    Verify the generated OTP
// @access  Public
router.post('/verify', verifyOTP);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', login);

module.exports = router;
