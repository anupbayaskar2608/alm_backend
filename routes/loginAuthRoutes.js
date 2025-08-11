import express from 'express';
import { loginUser, myAccount,getHome } from '../controllers/loginAuthController.js';


const router = express.Router();

// POST login details
router.post('/', loginUser);
router.get('/myAccount/:id', myAccount);
router.get('/dashboard',getHome);

export default router;
 