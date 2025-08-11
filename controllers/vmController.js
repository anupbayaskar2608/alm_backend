import VmContainer from "../models/VmContainer.js";
import IP_pool from "../models/IP_pool.js";
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import { ObjectId } from 'mongodb'; 

//Get All Vm Containers which are not deleted
export const getAllVmContainers = async (req, res) => {
    try {
        
        const vmcontainers = await VmContainer.find({ isDeleted: false });
        const userfullName = res.locals.fullName;
        const userId = res.locals.userId;
        const userRole = res.locals.role;
        const userEmail = res.locals.userMail;
        const countedVmContainers = await VmContainer.countDocuments({ isDeleted: false });

        res.status(200).json({ vmcontainers, countedVmContainers, userId, userRole, userEmail, userfullName });
    } catch (error) {
        res.status(500).json({
            message: 'Error getting workloads'
        });
    }
};

//Create new Vm Container/Workload
export const createVmContainer = async (req, res) => {  

    const data = req.body;

    if (await isWorkloadExists(data.vm_name)) {
        return res.status(400).json({ success: false, message: 'Workload already exists' });
      }
    const newId = await generatePrefixId('VM', 4, VmContainer, 'vm_id');

    let NICIDs = [];
    let counter = 1;

    for (var i = 0; i < data.nics; i++) {
        const ID = "NIC".concat(counter);
        const IP = "ipad".concat(counter);
        const netLabel = "netLabel".concat(counter);
        NICIDs.push({ id: ID, ip: data[IP], netLabel: data[netLabel] });
        const AssignedIPpool = await IP_pool.findOneAndUpdate({ "netLabel": data[netLabel], "IP_range.value": data[IP] }, { $set: { "IP_range.$.key": "assigned" } });
        counter++;
    }

    try {
        const newVmContainer = new VmContainer({
            vm_id: newId,
            vm_name: data.vm_name,
            host_ip: data.host_ip,
            vm_guest_os:data.vm_guest_os,
            vm_network: data.vm_network,
            NICs: data.nics,
            nic_ids: NICIDs,
            notes:data.notes
        });

        const savedVmContainer = await newVmContainer.save();

        res.status(201).json({ success: true, message: 'Workload created successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Workload.'
        });
    }
};

//check if workload is exists in database which is not deleted yet.
async function isWorkloadExists(vmName) {
    try {
      const workloadExist = await VmContainer.findOne({ vm_name: vmName, isDeleted: false });
      return !!workloadExist;
    } catch (error) {
      console.error(`Error checking if workload ${vmName} exists: ${error.message}`);
      return false;
    }
  }
//Modify/Update workload which is present in database
export const updateVmContainer = async (req, res) => {
    try {

        const id = req.params.id;
        const { vm_name, host_ip, vm_guest_os, vm_network, nics, notes } = req.body;

        let NICIDs = [];

        for (var i = 0; i < data.nics; i++) {
            const ID = "NIC" + i;
            const IP = 'NA';
            const netLabel = 'NA';
            NICIDs.push({ id: ID, ip: IP, netLabel: netLabel });
        }

        // Check if the request body contains valid data 
        if (!vm_name && !host_ip && !vm_guest_os && !vm_network && !nics && !notes) {
            return res.status(400).json({ success: false, message: 'Please provide valid data to update the workload' });
        }

        // Find the workload by its _id field and update it
        const updateVmContainer = await VmContainer.findByIdAndUpdate(id, {
            vm_name: vm_name,
            host_ip: host_ip,
            vm_guest_os: vm_guest_os,
            vm_network: vm_network,
            NICs: nics,
            nic_ids: NICIDs,
            notes: notes
        }, { new: true });

        // Check if the workload exists
        if (!updateVmContainer) {
            return res.status(404).json({
                success: false,
                message: 'Workload not found'
            });
        }

        // Return the updated workload to the client
        res.status(200).json({ success: true, workload: updateVmContainer });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while updating workload' });
    }
};

/* // Get a Vm Container Service
export const getVmContainerById = async (req, res) => {
    try {

        const id = (req.params.id).trim();
        console.log(id);
        const vmcontainer = await VmContainer.findById(id);

        if (!vmcontainer) {
            return res.status(404).json({ success: false, message: 'Workload not found' });
        }
        res.status(200).json({ success: true, vmcontainer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while getting workload by ID' });
    }
}; */

//Delete a Vm Container Service
export const deleteVmContainer = async (req, res, next) => {
    let id;
    try {
        id = req.params.id;

        // create a new ObjectId from the id string
        const objectId = new ObjectId(id);

        const vmcontainer = await VmContainer.findById(objectId);

        if (!vmcontainer) {
            return res.status(404).json({ error: 'workload not found' });
        }

        await VmContainer.softDelete(objectId);

        const message = `${vmcontainer.vm_name} workload has been deleted.`;

        res.json({ message });

    } catch (error) {
        console.error(`Error deleting workload with id ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getNicDataByVMid = async (req, res) => {
    const data = await VmContainer.findOne({ vm_id: req.body.id });
    res.json(data);
}
