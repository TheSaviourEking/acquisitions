import { jwttoken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Access token is required',
            });
        }

        // Verify token
        const decoded = jwttoken.verify(token);
        req.user = decoded;

        logger.info(`User authenticated: ${decoded.email}`);
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token',
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    logger.warn(`Access denied for non-admin user: ${req.user?.email}`);
    return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
    });
};
