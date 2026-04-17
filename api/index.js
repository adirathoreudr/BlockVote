const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../backend/routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'BlockVote Backend is live on Vercel.',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Database connection logic for serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('CONFIG_ERROR: MONGO_URI is missing in Vercel Environment Variables.');
    }

    try {
        await mongoose.connect(uri, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ 
            message: err.message.includes('CONFIG_ERROR') 
                ? err.message 
                : 'Database connection failed. Check your IP whitelist (Allow 0.0.0.0/0) and credentials.' 
        });
    }
});

module.exports = app;
