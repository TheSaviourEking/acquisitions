import logger from '#config/logger.js';
import authService from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { signupSchema, signinSchema } from '#validations/auth.validation.js';

export const signup = async (req, res, _next) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        console.log(validationResult, 'validatonResult');

        const { name, email, password, role } = validationResult.data;
        console.log(name, email, password, role);

        // AUTH SERVICE=
        const user = await authService.createUser({
            name,
            email,
            password,
            role,
        });
        const token = jwttoken.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        cookies.set(res, 'token', token);

        logger.info(`User registered successfully: ${email}`);
        res.status(201).json({
            message: 'User registered',
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                token,
            },
        });
    } catch (e) {
        logger.error('Signup error', e);

        if (e.message === 'User with this email already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

export const signin = async (req, res, _next) => {
    try {
        const validationResult = signinSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        const { email, password } = validationResult.data;

        const user = await authService.authenticateUser({ email, password });
        const token = jwttoken.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        cookies.set(res, 'token', token);

        logger.info(`User signed in successfully: ${email}`);
        res.status(200).json({
            message: 'User signed in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (e) {
        logger.error('Signin error', e);

        if (e.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

export const signout = async (req, res, _next) => {
    try {
        // Clear the token cookie
        cookies.clear(res, 'token');

        logger.info('User signed out successfully');
        res.status(200).json({
            message: 'User signed out successfully',
        });
    } catch (e) {
        logger.error('Signout error', e);
        res.status(500).json({ error: 'Internal server error' });
    }
};
