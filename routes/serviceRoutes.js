import express from 'express';
import {
  getAllServices,
  createService,
  updateService,
  getServiceById,
  deleteService
} from '../controllers/servicesController.js';

import auth from '../middleware/authController.js'


const router = express.Router()
// Get all services
router.get('/',getAllServices);

// Create a new service
router.post('/',createService);

// Update an existing service by ID
router.put('/:id', updateService);

// Get a service by ID
router.get('/:id', getServiceById);

// Delete a service by ID
router.delete('/:id', deleteService);

export default router;
