import express from 'express';
import {
    getAllVmContainers,
    createVmContainer,
    updateVmContainer,
    //getVmContainerById,
    deleteVmContainer,
    getNicDataByVMid
} from '../controllers/vmController.js';

import auth from '../middleware/authController.js'

const router = express.Router();

// Get all workloads
router.get('/',getAllVmContainers);

// Create a new workload
router.post('/',createVmContainer);

// Update an workload service by ID
router.put('/:id', updateVmContainer);

// Get a workload by ID
//router.get('/:id', getVmContainerById);

// Delete a workload by ID
router.delete('/:id', deleteVmContainer);

router.post('/GetVmNic', getNicDataByVMid);

export default router;
