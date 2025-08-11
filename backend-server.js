// Import dependencies
import express from 'express';
import dbConnect from './config/dbconfig.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { join } from 'path';
import cookieParser from 'cookie-parser';

// Import all routes 
import regionRoutes from './routes/regionRoutes.js';
import deptRoutes from './routes/deptRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loginRoute from './routes/loginAuthRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import securitygroupsRoutes from './routes/securityGroupRoutes.js';
import applicationRoutes from './routes/applicationsRoutes.js';
import ippoolRoutes from './routes/ippoolRoutes.js';
import workloadRoutes from './routes/workloadRoutes.js';
import appVmRoutes from './routes/appvmRoutes.js';

// Import defaultUser function from userController
import { defaultUser } from './controllers/userController.js';

import db from './models/dbPromise.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
// Allow CORS from the specified frontend URL and enable credentials
app.use(cors({ origin: FRONTEND_URL, credentials: true,}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(join(process.cwd(), 'public')));

// Routes
// Mount the corresponding middleware for each route
app.use('/users', userRoutes);
app.use('/login', loginRoute);
app.use('/regions', regionRoutes);
app.use('/dept', deptRoutes);
app.use('/services', serviceRoutes);
app.use('/securitygroups', securitygroupsRoutes);
app.use('/applications', applicationRoutes);
app.use('/ippools', ippoolRoutes);
app.use('/workloads', workloadRoutes);
app.use('/appvms', appVmRoutes);

// Start the server and connect to the database
async function startServer() {
  try {
    
    await dbConnect();

    // Create a default user in the database
    await defaultUser();

    // Listen for incoming requests on the specified port
    app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));

  } catch (error) {
    console.error(error);
  }
}

startServer();