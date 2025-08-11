import Application from "../models/Application.js";
import {v4 as uuidv4} from 'uuid';
import { ObjectId } from 'mongodb';

//Get All Applications which are not deleted
export const getAllApplications = async (req, res, next) => {

    try {
        const list = await Application.find().exec();
        const coutedApplications = await Application.countDocuments({
            isDeleted: false
        });
        res.status(200).json({applications: list,coutedApplications});
    } catch (error) {
        res.status(500).json({
            message: 'Error getting applications'
        });
    }
}

//check if Applications is exists in database which is not deleted yet.
async function isApplicationExists(apm_id) {
    try {
        // Find a application with the given apm_id and is not deleted
        const applicationExist = await Application.findOne({ apm_id: apm_id, isDeleted: false });

        // Return true if a application is found, false otherwise
        return !!applicationExist;

    } catch (error) {
        console.error(`Error checking if application ${apm_id} exists: ${error.message}`);
        return false;
    }
}

//Create new Applications
export const createApplication = async (req, res, next) => {
  try {
    const app_uuid = uuidv4();
    const data = req.body;
    
    // Validate data
    if (!data.apm_id || !data.application_name || !data.application_type || !data.application_facing_type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check if application with given apm_id already exists
    if (await isApplicationExists(data.apm_id)) {
      return res.status(400).json({ success: false, message: 'Application already exists' });
    }

    // Create new application
    const application = new Application({
      application_id: app_uuid,
      apm_id: data.apm_id,
      application_name: data.application_name,
      application_type: data.application_type,
      application: data.application,
      application_facing_type: data.application_facing_type,
      application_priority_type: data.application_priority_type,
      notes: data.notes
    });

    await application.save();

    // Return created application
    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while creating application'
    });
  }
}


//Update Applications which is present in database
export const updateApplication = async (req, res, next) => {
    try {

        const id = req.params.id;
      
        const { application_name, application_type, application, application_facing_type, application_priority_type, notes } = req.body;
      
        // Check if the request body contains valid data 
        if (!application_name && !application_type && !application && !application_facing_type && !application_priority_type && !notes) {
          return res.status(400).json({
            success: false,
            message: 'Please provide valid data to update the application'
          });
        }
      
        // Find the application by its _id field and update it.
      
        let update_application_data = await Application.findByIdAndUpdate(id, {
          application_name: application_name,
          application_type: application_type,
          application: application,
          application_facing_type: application_facing_type,
          application_priority_type: application_priority_type,
          notes: notes
      
        }, { new: true });
      
      
        // Check if the application exists
        if (!update_application_data) {
          return res.status(404).json({
            success: false,
            message: 'application not found'
          });
        }
      
        // Return the updated application to the client
        res.status(200).json({ success: true, application: update_application_data });
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while updating application' });
      }
}

//Get a single Application
export const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
      
        if (!application) {
          return res.status(404).json({
            success: false,
            message: 'application not found'
          });
        }
      
        res.status(200).json({ success: true, application });
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while getting application by ID' });
      }
}

//Delete a single Application
export const deleteApplication = async (req, res, next) => {
    let id;
    try {
        id = req.params.id;

        // create a new ObjectId from the id string
        const objectId = new ObjectId(id);

        const application = await Application.findById(objectId);

        if (!application) {
            return res.status(404).json({ error: 'application not found' });
        }

        await Application.softDelete(objectId);

        const message = `${application.application_name} application has been deleted.`;

        res.json({ message });

    } catch (error) {
        console.error(`Error deleting application with id ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}