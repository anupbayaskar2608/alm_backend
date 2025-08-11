import express from 'express';
import {
  getAllIPPool,
  createIPPool,
  updateIPPool,
  //getIPPoolById,
  deleteIPPool,
  getListOfIP,
  getIpRangedatabyid,
  getNetworkLabel
} from '../controllers/ippoolController.js';

import auth from '../middleware/authController.js'


const router = express.Router();

// Get all IP Pools
router.get('/',getAllIPPool);

// Create a new IP Pool
router.post('/',createIPPool);

// Update an existing IP Pool by ID
router.put('/:id', updateIPPool);

// Get a IP Pool by ID
//router.get('/:id', getIPPoolById);

// Delete a IP Pool by ID
router.delete('/:id', deleteIPPool);

router.post('/getIplist',getListOfIP);

router.post('/getIpRangedatabyid',getIpRangedatabyid);

router.get('/getNetworkLabel', getNetworkLabel);

export default router;
