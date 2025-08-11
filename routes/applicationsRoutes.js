import express from 'express';
import {
    getAllApplications,
    createApplication,
    updateApplication,
    getApplicationById,
    deleteApplication
} from '../controllers/applicationController.js';

import auth from '../middleware/authController.js'

const router = express.Router()

// Get all applications
router.get('/', getAllApplications);

// Create a new application
router.post('/', createApplication);

// Update an existing application by ID
router.put('/:id', updateApplication);

// Get a application by ID
router.get('/:id', getApplicationById);

// Delete a application by ID
router.delete('/:id', deleteApplication);

export default router;