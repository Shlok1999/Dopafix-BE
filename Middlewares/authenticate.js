const jwt = require('jsonwebtoken');
const { User } = require('../Models/UserModel');
const secretKey = process.env.JWT_SECRET || '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';


const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, secretKey);

        // Attach decoded user data to the request
        req.user = decoded;

        // Optionally, verify the user exists in the database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Optional: Validate user's status or roles
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'User is inactive' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Catch-all error
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Store decoded user info in request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = {authenticate,authMiddleware}; // Export the middleware as a callback
