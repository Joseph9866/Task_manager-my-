const jwt = require('jsonwebtoken');

// Middleware to verify JWT and attach user to request
exports.protect = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Make sure your JWT contains both id and role
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Not authorized, token failed' });
    }
};

// Flexible role-based middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
