import Region from '../models/Region.js';
import generatePrefixId from "../middleware/prefixIdGenerator.js";

//Get All Regions which are not deleted
export const getAllRegions = async (req, res) => {
  try {
    
    const regions = await Region.find({ isDeleted: false });
    const userfullName = res.locals.fullName;
    const userId = res.locals.userId;
    const userRole = res.locals.role;
    const userEmail = res.locals.userMail;
   
    res.status(200).json({ regions, userId, userRole, userEmail, userfullName});
  } catch (error) {
    res.status(500).json({
      message: 'Error getting regions'
    });
  }
};
//Create new Region
export const createRegion = async (req, res) => {
  const { regionName, postalAddress, notes } = req.body;

  if (await isRegionExists(regionName)) {
    return res.status(400).json({
      success: false,
      message: 'Region already exists'
    });
  }
  const newId = await generatePrefixId('RE', 4, Region, 'region_id');
  try {
    const newRegion = new Region({
      region_id: newId,
      region_name: regionName,
      postal_address: postalAddress,
      notes: notes
    });

    const savedRegion = await newRegion.save();
    res.status(201).json({
      success: true,
      message: 'Region created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while creating region'
    });
  }
};

//check if Region is exists in database which is not deleted yet.
async function isRegionExists(regionName) {
  try {
    // Find a region with the given name and is not deleted
    const regionExist = await Region.findOne({
      region_name: regionName,
      isDeleted: false
    });
    // Return true if a region is found, false otherwise
    return !!regionExist;
  } catch (error) {
    console.error(`Error checking if region ${regionName} exists: ${error.message}`);
    return false;
  }
}

//Modify/Update Region which is present in database
export const updateRegion = async (req, res) => {
  try {
    // Check if the request body contains valid data 
    if (!req.body.region_name && !req.body.postal_address && !req.body.notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid data to update the region'
      });
    }

    // Find the region by its _id field and update it
    const updatedRegion = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Check if the region exists
    if (!updatedRegion) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }

    // Return the updated region to the client
      res.status(200).json({
      success: true,
      region: updatedRegion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while updating region'
    });
  }
};



// Get a single Region
export const getRegionById = async (req, res) => {
  try {
    const region = await Region.findById( req.params.id);
    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }
    res.status(200).json({
      success: true,
      region
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while getting region by ID'
    });
  }
};

//Delete a single Region
import { ObjectId } from 'mongodb';

export const deleteRegion = async (req, res, next) => {
  let id;
  try {
      id = req.params.id;

      // create a new ObjectId from the id string
      const objectId = new ObjectId(id);

      const region = await Region.findById(objectId);

      if (!region) {
          return res.status(404).json({ error: 'Region not found' });
      }

      await Region.softDelete(objectId);
      const message = `${region.region_name} region has been deleted.`;
      
      res.json({ message });
  } catch (error) {
      console.error(`Error deleting region with id ${id}: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
  }
};


