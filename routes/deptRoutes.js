import express from 'express';
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  getDepartmentById,
  deleteDepartment
} from '../controllers/deptController.js';
import auth from '../middleware/authController.js';

const router = express.Router();

// Get all departments
router.get('/', getAllDepartments); 

// Create a new department
router.post('/', createDepartment);

// Update an existing department by ID
router.put('/:id', updateDepartment);

// Get a department by ID
router.get('/:id', getDepartmentById);

// Delete a department by ID
router.delete('/:id', deleteDepartment);

export default router;
