import express from 'express';
import {
  getAllRegions,
  createRegion,
  updateRegion,
  getRegionById,
  deleteRegion
} from '../controllers/regionController.js';
import auth from '../middleware/authController.js'


const router = express.Router()
// Get all regions
router.get('/',getAllRegions);

// Create a new region
router.post('/',createRegion);

// Update an existing region by ID
router.put('/:id', updateRegion);

// Get a region by ID
router.get('/:id', getRegionById);

// Delete a region by ID
router.delete('/:id', deleteRegion);

export default router;
