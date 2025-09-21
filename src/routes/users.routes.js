import { fetchAllUsers, getUserById, updateUser, deleteUser } from '#controllers/users.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get all users - requires admin role
router.get('/', requireAdmin, fetchAllUsers);

// Get user by ID - users can get their own info, admins can get any user info
router.get('/:id', getUserById);

// Update user - users can update their own info, admins can update any user
router.put('/:id', updateUser);

// Delete user - users can delete their own account, admins can delete any user
router.delete('/:id', deleteUser);

export default router;