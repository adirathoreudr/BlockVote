const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Assume format is "Bearer <token>"
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'supersecretjwtkey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
