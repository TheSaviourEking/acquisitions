import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

const getAllUsers = async () => {
    try {
        const fetchedUsers = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            })
            .from(users);

        return fetchedUsers;
    } catch (error) {
        logger.error('Error getting users', error);
        throw error;
    }
};

const getUserById = async id => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        logger.error(`Error getting user by ID ${id}:`, error);
        throw error;
    }
};

const updateUser = async (id, updates) => {
    try {
        // Check if user exists
        const [existingUser] = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Add updated_at timestamp to updates
        const updatesWithTimestamp = {
            ...updates,
            updated_at: new Date(),
        };

        // Perform the update
        const [updatedUser] = await db
            .update(users)
            .set(updatesWithTimestamp)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            });

        logger.info(`User ${id} updated successfully`);
        return updatedUser;
    } catch (error) {
        logger.error(`Error updating user ${id}:`, error);
        throw error;
    }
};

const deleteUser = async id => {
    try {
        // Check if user exists
        const [existingUser] = await db
            .select({
                id: users.id,
                email: users.email,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Delete the user
        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
            });

        logger.info(`User ${existingUser.email} deleted successfully`);
        return deletedUser;
    } catch (error) {
        logger.error(`Error deleting user ${id}:`, error);
        throw error;
    }
};

const usersService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};

export default usersService;
