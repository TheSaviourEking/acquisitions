import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWS_SECRET =
    process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
    sign: payload => {
        try {
            return jwt.sign(payload, JWS_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            logger.error('Failed to authenticate token', error);
            throw new Error('Failed to authenticate token');
        }
    },

    verify: token => {
        try {
            return jwt.verify(token, JWS_SECRET);
        } catch (error) {
            logger.error('Failed to authenticate token', error);
            throw new Error('Failed to authenticate token');
        }
    },
};
