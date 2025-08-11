import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUserById,
  getUserById,
  deleteUserById
} from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Create a new user
router.post('/', createUser);

// Update an existing user by ID
router.put('/:id', updateUserById);

// Get a user by ID
router.get('/:id', getUserById);

// Delete a user by ID
router.delete('/:id', deleteUserById);

export default router;
