import express from 'express';
import {
    getAllSecurityGroups,
    createSecurityGroup,
    updateSecurityGroup,
    getSecurityGroupById,
    deleteSecurityGroup
} from '../controllers/securityGroupController.js';

import auth from '../middleware/authController.js'


const router = express.Router()
// Get all Security Groups
router.get('/',getAllSecurityGroups);

// Create a new security Group
router.post('/',createSecurityGroup);

// Update an existing security Group by ID
router.put('/:id', updateSecurityGroup);

// Get a security Group by ID
router.get('/:id', getSecurityGroupById);

// Delete a security Group by ID
router.delete('/:id', deleteSecurityGroup);

export default router;