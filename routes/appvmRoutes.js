import express from 'express';
import {
  getAllAvmMappings,
  createAppVmMapping,
  updateAppVmMapping,
  getAppVmMappingById,
  deleteAppVmMapping,
  getAppdatabyID,
  getUAppdatabyID,
  getDeptHeadDatabyid,
  getUpdateDeptHeadDatabyid,
  getuserDataAppVMDatabyid,
  getUpdateuserDataAppVMDatabyid
} from '../controllers/appAndvmController.js';

import auth from '../middleware/authController.js'

const router = express.Router();

// Get all App and Vm Mapping records
router.get('/', getAllAvmMappings);

// Create a new App and Vm Mapping record
router.post('/', createAppVmMapping);

// Update an App and Vm Mapping record by ID
router.put('/:id', updateAppVmMapping);

// Get an App and Vm Mapping record by ID
router.get('/:id', getAppVmMappingById);

// Delete an App and Vm Mapping record by ID
router.delete('/:id', deleteAppVmMapping);

// Get app data by ID
router.post('/getAppdatabyid', getAppdatabyID);

// Get uapp data by ID
router.post('/getuAppdatabyid', getUAppdatabyID);

// Get department head data by ID
router.post('/getDeptHeadDatabyid', getDeptHeadDatabyid);

// Update department head data by ID
router.post('/getUpdateDeptHeadDatabyid', getUpdateDeptHeadDatabyid);

// Get user data app vm data by ID
router.post('/getuserDataAppVMDatabyid', getuserDataAppVMDatabyid);

// Update user data app vm data by ID
router.post('/getUpdateuserDataAppVMDatabyid', getUpdateuserDataAppVMDatabyid);

export default router;