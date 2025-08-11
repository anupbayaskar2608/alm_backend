import Security_Group from "../models/SecurityGroup.js";
import Service from "../models/Service.js";
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import { ObjectId } from 'mongodb';

//Get All Security Groups which are not deleted
export const getAllSecurityGroups = async (req, res) => {
    try {
      
        const securitygroups = await Security_Group.aggregate([
            { "$match": { "isDeleted": false } },

            {
                $lookup:
                {
                    from: "services",
                    localField: "services.service_id",
                    foreignField: "service_id",
                    as: "item1",
                    pipeline: [{ $match: { $expr: { $eq: ["$isDeleted", false] } } }]
                }
            },

            {
                $project:
                {
                    "_id": 1,
                    "security_group_name": 1,
                    "services": 1,
                    "notes": 1,
                    "ServiceName": "$item1.service_name",
                    "ServiceId": "$item1.service_id"
                }
            }
        ]);


    const coutedSecuirtyGroups = await Security_Group.countDocuments({ isDeleted: false });

    const dbServices = await Service.find();
     
      res.status(200).json({securitygroups,coutedSecuirtyGroups,dbServices});

    } catch (error) {
      res.status(500).json({
        message: 'Error getting services'
      });
    }
  };

//Create new service
export const createSecurityGroup = async (req, res) => {

    const { security_group_name, services, notes } = req.body;

    let selected_Services = [];

    for (let i = 0; i < services.length; i++) {
        selected_Services.push({ service_id: services[i] });
    }
  
    if (await isSecurityGroupExists(security_group_name)) {
      return res.status(400).json({
        success: false,
        message: 'security group already exists'
      });
    }

    const newId = await generatePrefixId('SG', 4, Security_Group, 'secg_id');

    try {
      const newSecurityGroup = new Security_Group({
        secg_id: newId,
        security_group_name:security_group_name,
        services: selected_Services,
        notes: notes
      });
  
      const savedSecurityGroup = await newSecurityGroup.save();
      res.status(201).json({
        success: true,
        message: 'Security Group created successfully.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while creating Security Group.'
      });
    }
  };

//check if security group is exists in database which is not deleted yet.
async function isSecurityGroupExists(security_group_name) {
    try {
      // Find a security group with the given name and is not deleted
      const serviceExist = await Security_Group.findOne({
        security_group_name: security_group_name,
        isDeleted: false
      });
      // Return true if a security group is found, false otherwise
      return !!serviceExist;
    } catch (error) {
      console.error(`Error checking if security group ${security_group_name} exists: ${error.message}`);
      return false;
    }
  }

  //Modify/update Security Group which is present in database
export const updateSecurityGroup = async (req, res) => {
    try {

      const { security_group_name, notes,services_edit } = req.body;

      const id = req.params.id;

      console.log("Id"+id);

      // Check if the request body contains valid data 
      if (!security_group_name && !services_edit && !notes) {
        return res.status(400).json({
          success: false,
          message: 'Please provide valid data to update the Security Group'
        });
      }

      let selected_Services = [];

      for (let i = 0; i < services_edit.length; i++) {
          selected_Services.push({ service_id: services_edit[i] });
      }

      // Find the Security Group by its _id field and update it
      const updateSecurityGroup = await Security_Group.findByIdAndUpdate(id, {
        security_group_name: security_group_name,
        services: selected_Services,
        notes: notes
    }, { new: true });
  
      // Check if the Security Group exists
      if (!updateSecurityGroup) {
        return res.status(404).json({
          success: false,
          message: 'Security Group not found'
        });
      }
  
      // Return the updated Security Group to the client
        res.status(200).json({ success: true, service: updateSecurityGroup});

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while updating Security Group'
      });
    }
  };

// Get a single Security Group
export const getSecurityGroupById = async (req, res) => {
    try {
      const securitygroup = await Security_Group.findById( req.params.id);
      if (!securitygroup) {
        return res.status(404).json({
          success: false,
          message: 'Security Group not found'
        });
      }
      res.status(200).json({
        success: true,
        securitygroup
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while getting Security Group by ID'
      });
    }
  };

//Delete a single Security Group
export const deleteSecurityGroup = async (req, res, next) => {
    let id;
    try {
      id = req.params.id;
  
      // create a new ObjectId from the id string
      const objectId = new ObjectId(id);
  
      const securitygroup = await Security_Group.findById(objectId);
  
      if (!securitygroup) {
          return res.status(404).json({ error: 'Security Group not found' });
      }
  
      await Security_Group.softDelete(objectId);
  
      const message = `${securitygroup.security_group_name} security group has been deleted.`;
      
      res.json({ message });
  
  } catch (error) {
      console.error(`Error deleting security group with id ${id}: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
  }
  };
  