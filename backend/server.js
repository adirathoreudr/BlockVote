const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BlockVote Backend is running.' });
});

// Database connection logic for serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blockvote');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

// Start server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Local Server running on port ${PORT}`);
        });
    });
}

// Ensure DB connects for every serverless invocation
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

module.exports = app;

