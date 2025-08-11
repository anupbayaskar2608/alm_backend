import Service from "../models/Service.js";
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import { ObjectId } from 'mongodb';

//Get All services which are not deleted
export const getAllServices = async (req, res) => {
    try {
      
      const services = await Service.find({ isDeleted: false });
      console.log(services);
      const userfullName = res.locals.fullName;
      const userId = res.locals.userId;
      const userRole = res.locals.role;
      const userEmail = res.locals.userMail;
     
      res.status(200).json({ services, userId, userRole, userEmail, userfullName});
    } catch (error) {
      res.status(500).json({
        message: 'Error getting services'
      });
    }
  };

//Create new service
export const createService = async (req, res) => {

    const { service_name, ports, protocols, notes } = req.body;
  
    if (await isServiceExists(service_name)) {
      return res.status(400).json({ success: false, message: 'Service already exists'});
    }

    const newId = await generatePrefixId('SV', 4, Service, 'service_id');

    try {
      const newService = new Service({
        service_id: newId,
        service_name:service_name,
        ports: ports,
        protocols: protocols,
        notes: notes
      });
  
      const savedService = await newService.save();

      res.status(201).json({ success: true, message: 'Service created successfully.'});
      
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while creating service.'
      });
    }
  };

//check if Service is exists in database which is not deleted yet.
async function isServiceExists(service_name) {
    try {
      // Find a service with the given name and is not deleted
      const serviceExist = await Service.findOne({ service_name: service_name, isDeleted: false });
      // Return true if a service is found, false otherwise
      return !!serviceExist;

    } catch (error) {
      console.error(`Error checking if service ${service_name} exists: ${error.message}`);
      return false;
    }
  }

  //Modify/Update Service which is present in database
export const updateService = async (req, res) => {
    try {
      // Check if the request body contains valid data 
      if (!req.body.service_name && !req.body.ports && !req.body.protocols && !req.body.notes) {
        return res.status(400).json({ success: false, message: 'Please provide valid data to update the service'});
      }
  
      // Find the service by its _id field and update it
      const updateService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      // Check if the service exists
      if (!updateService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
  
      // Return the updated service to the client
        res.status(200).json({ success: true, service: updateService}); 

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error while updating service'});
    }
  };

// Get a single Service
export const getServiceById = async (req, res) => {
    try {
      const service = await Service.findById( req.params.id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
      res.status(200).json({
        success: true,
        service
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while getting service by ID'
      });
    }
  };

//Delete a single Service
export const deleteService = async (req, res, next) => {
  let id;
  try {
    id = req.params.id;

    // create a new ObjectId from the id string
    const objectId = new ObjectId(id);

    const service = await Service.findById(objectId);

    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }

    await Service.softDelete(objectId);

    const message = `${service.service_name} service has been deleted.`;
    
    res.json({ message });

} catch (error) {
    console.error(`Error deleting service with id ${id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
}
};

  