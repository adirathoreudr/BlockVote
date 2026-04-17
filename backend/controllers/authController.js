const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Warning: This requires environment variables to be set locally
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        if (user) {
            // Update unverified user
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        } else {
            // Create brand new user
            user = new User({
                email,
                password: hashedPassword,
                otp,
                otpExpires: Date.now() + 10 * 60 * 1000
            });
        }
        await user.save();

        let emailSent = false;
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                // Send email
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Block Vote - Verify your email',
                    text: `Your OTP is ${otp}`
                });
                emailSent = true;
            } catch (mailError) {
                console.error('Email Delivery Error:', mailError);
            }
        } else {
            console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
        }

        res.status(201).json({ 
            message: emailSent 
                ? 'Registration successful. Please check your email for the OTP.' 
                : 'Registration successful! (Email Delivery skipped/failed). Use the OTP from server logs for testing.',
            devOtp: (process.env.NODE_ENV !== 'production') ? otp : undefined 
        });
    } catch (error) {
        console.error('Registration Controller Error:', error);
        res.status(500).json({ message: `Registration failed: ${error.message}` });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });
        
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET || 'supersecretjwtkey', 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
