import logger from '#config/logger.js';
import usersService from '#services/users.service.js';
import { formatValidationError } from '#utils/format.js';
import {
    userIdSchema,
    updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
    try {
        logger.info('Getting Users...');

        const allUsers = await usersService.getAllUsers();

        res.json({
            message: 'Successfully retrieved users',
            users: allUsers,
            count: allUsers.length,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        // Validate request parameters
        const validationResult = userIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        const { id } = validationResult.data;
        const currentUser = req.user;

        // Authorization check: users can only get their own info, admins can get any user info
        if (currentUser.id !== id && currentUser.role !== 'admin') {
            logger.warn(
                `User ${currentUser.email} attempted to access user ${id}`
            );
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only access your own information',
            });
        }

        logger.info(`Getting user with ID: ${id}`);
        const user = await usersService.getUserById(id);

        res.json({
            message: 'User retrieved successfully',
            user,
        });
    } catch (error) {
        logger.error(`Error getting user: ${error.message}`);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        // Validate request parameters
        const paramValidation = userIdSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(paramValidation.error),
            });
        }

        // Validate request body
        const bodyValidation = updateUserSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(bodyValidation.error),
            });
        }

        const { id } = paramValidation.data;
        const updates = bodyValidation.data;
        const currentUser = req.user;

        // Authorization checks
        // Users can only update their own information
        if (currentUser.id !== id && currentUser.role !== 'admin') {
            logger.warn(
                `User ${currentUser.email} attempted to update user ${id}`
            );
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update your own information',
            });
        }

        // Only admins can change user roles
        if (updates.role && currentUser.role !== 'admin') {
            logger.warn(
                `Non-admin user ${currentUser.email} attempted to change role`
            );
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Only administrators can change user roles',
            });
        }

        logger.info(`Updating user ${id} by ${currentUser.email}`);
        const updatedUser = await usersService.updateUser(id, updates);

        res.json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        // Validate request parameters
        const validationResult = userIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        const { id } = validationResult.data;
        const currentUser = req.user;

        // Authorization checks
        // Users can delete their own account, or admins can delete any account
        if (currentUser.id !== id && currentUser.role !== 'admin') {
            logger.warn(
                `User ${currentUser.email} attempted to delete user ${id}`
            );
            return res.status(403).json({
                error: 'Forbidden',
                message:
                    'You can only delete your own account or admin can delete any account',
            });
        }

        // Prevent admins from deleting themselves (business rule)
        if (currentUser.id === id && currentUser.role === 'admin') {
            logger.warn(
                `Admin ${currentUser.email} attempted to delete their own account`
            );
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Administrators cannot delete their own accounts',
            });
        }

        logger.info(`Deleting user ${id} by ${currentUser.email}`);
        const deletedUser = await usersService.deleteUser(id);

        res.json({
            message: 'User deleted successfully',
            user: deletedUser,
        });
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        next(error);
    }
};
