import IP_Pool from "../models/IP_pool.js";
import { ObjectId } from 'mongodb';
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import range from 'ip-range-generator';
import pkg from 'netmask6';
const { Netmask } = pkg;

//Get All IP Pool which are not deleted
export const getAllIPPool = async (req, res) => {
    try {

        const ip_pools = await IP_Pool.find({ isDeleted: false });
        const userfullName = res.locals.fullName;
        const userId = res.locals.userId;
        const userRole = res.locals.role;
        const userEmail = res.locals.userMail;

        const countedDBIP_Pool = await IP_Pool.countDocuments({ isDeleted: false });

        res.status(200).json({ ip_pools, countedDBIP_Pool, userId, userRole, userEmail, userfullName });

    } catch (error) {
        res.status(500).json({
            message: 'Error getting IP Pool'
        });
    }
};

//Create new IP Pool
export const createIPPool = async (req, res) => {

    const { IP_poolAddr, netLabel, vlanID, add_gateway, ovl_net, notes, subnetMask } = req.body;

    const newId = await generatePrefixId('IPL', 4, IP_Pool, 'pool_id');

    const tempSubnetCIDR = (subnetMask).split("/");     //  Seprating SUBNET MASK and CIDR form user input.
    const user_Inputed_Subnet = (tempSubnetCIDR[0]);   //  Taking Subnet Mask value form user input.
    const user_Inputed_CIDR = (tempSubnetCIDR.pop());  //  Taking CIDR value form user input.

    //  Genrating IP address Array using user input.
    const tempIPBlock = Netmask.v4.parse(((IP_poolAddr).concat("/" + user_Inputed_CIDR)));
    const Total_Hosts = (tempIPBlock.size.toString());    //  Calculating No of Hosts.
    var IP_Address_Pool = [];                               // Initializing empty array for storing newlay generted ip addresss.

    // passing each generated ip address's from range and stoing in array testIP.
    for (let ip of range(tempIPBlock.firstIP.toString(), tempIPBlock.lastIP.toString())) {
        const IP_Key = 'unassigned';
        var IP_Value = ip;
        IP_Address_Pool.push({ key: IP_Key, value: IP_Value });

    }

    IP_Address_Pool[0].key = 'Network ID';
    IP_Address_Pool[IP_Address_Pool.length - 1].key = 'BroadCast ID'

    const updated_IP_Address_Pool = IP_Address_Pool.map(item =>
  item.value === add_gateway ? { ...item, key: 'Gateway' } : item
);


    if (await isIPPoolExists(netLabel)) {
        return res.status(400).json({ success: false, message: 'New Network profile already exists' });
    }

    try {

        const IP_SubnetExist = await IP_Pool.findOne({ subnetMask: user_Inputed_Subnet, IP_range: IP_Address_Pool });

        //check if ip_range and subnet exist
        if (!IP_SubnetExist) {

            let newIP_Pool = await new IP_Pool(
                {
                    pool_id: newId,
                    netLabel: netLabel,
                    IP_poolAddr: IP_poolAddr,
                    subnetMask: user_Inputed_Subnet,
                    CIDR: user_Inputed_CIDR,
                    vlanID: vlanID,
                    gateway: add_gateway,
                    noOfHosts: Total_Hosts,
                    IP_range: IP_Address_Pool,
                    Overlay_Network: ovl_net,
                    notes: notes
                }
            );

            const savedIP_Pool = await newIP_Pool.save();
            res.status(201).json({ success: true, message: 'New Network profile created successfully.' });

        }
        else {
            res.status(400).json({ success: false, message: 'Network profile already exists' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating New Network profile.'
        });
    }
};

//check if IP Pool is exists in database which is not deleted yet.
async function isIPPoolExists(netLabel) {
    try {

        // Find a IP Pool with the given name and is not deleted
        const ippoolExist = await IP_Pool.findOne({ netLabel: netLabel, isDeleted: false });

        // Return true if a IP Pool is found, false otherwise
        return !!ippoolExist;

    } catch (error) {
        console.error(`Error checking if IP Pool ${netLabel} exists: ${error.message}`);
        return false;
    }
}

//Update IP Pool which is present in database
export const updateIPPool = async (req, res) => {
    try {
  
      const { netLabel, IP_poolAddr, subnetMask, CIDR, vlanId, gateway, noOfHosts, Overlay_Network, notes } = req.body;
  
      // Check if the request body contains valid data 
      if (!netLabel && !IP_poolAddr && !subnetMask && !CIDR && !vlanId && !gateway && !noOfHosts && !Overlay_Network && !notes) {
        return res.status(400).json({
          success: false,
          message: 'Please provide valid data to update the Network profile'
        });
      }
  
      // Find the IP_Pool by its _id field and update ii.
      const id = req.params.id;
      let updateIPPool = await IP_Pool.findByIdAndUpdate(id,
        {
          netLabel: netLabel,
          IP_poolAddr: IP_poolAddr,
          //subnetMask: user_Inputed_Subnet,
          // CIDR: user_Inputed_CIDR,
          vlanId: vlanId,
          gateway: gateway,
          noOfHosts: noOfHosts,
          Overlay_Network: Overlay_Network,
          notes: notes
        },
        { new: true });
  
      // Check if the IP_Pool exists
      if (!updateIPPool) {
        return res.status(404).json({
          success: false,
          message: 'Network profile not found'
        });
      }
  
      // Return the updated IP_Pool to the client
      res.status(200).json({ success: true, ippool: updateIPPool });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error while updating Network profile' });
    }
  };

// Get a single IP Pool
export const getIPPoolById = async (req, res) => {
    try {
      const ippool = await IP_Pool.findById(req.params.id);
      if (!ippool) {
        return res.status(404).json({
          success: false,
          message: 'Network profile not found'
        });
      }
      res.status(200).json({
        success: true,
        ippool
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while getting Network profile by ID'
      });
    }
  };
  
//Delete a single IP Pool
export const deleteIPPool = async (req, res, next) => {
    let id;
    try {
      id = req.params.id;
  
      // create a new ObjectId from the id string
      const objectId = new ObjectId(id);
  
      const ippool = await IP_Pool.findById(objectId);
  
      if (!ippool) {
        return res.status(404).json({ error: 'Network profile not found' });
      }
  
      await IP_Pool.softDelete(objectId);
  
      const message = `${ippool.netLabel} Network profile has been deleted.`;
  
      res.json({ message });
  
    } catch (error) {
      console.error(`Error deleting Network profile with id ${id}: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
export const getListOfIP = async (req, res, next) => {

  const params = req.body;

  const tempSubnetCIDR = (params.cidr).split("/");     //  Seprating SUBNET MASK and CIDR form user input.
  const user_Inputed_CIDR = (tempSubnetCIDR.pop());          //  Taking CIDR value form user input.

  //  Genrating IP address Array using user input.
  const tempIPBlock = Netmask.v4.parse(((params.ip).concat("/" + user_Inputed_CIDR)));

  var data = [];                               // Initializing empty array for storing newlay generted ip addresss.

  // passing each generated ip address's from range and stoing in array testIP.
  for (let ip of range(tempIPBlock.firstIP.toString(), tempIPBlock.lastIP.toString())) {
    const IP_Key = 'unassigned';
    var IP_Value = ip;
    data.push({ key: IP_Key, value: IP_Value });
  }

  data[0].key = 'Network ID';
  data[data.length - 1].key = 'BroadCast ID'

  res.json(data);
}

export const getIpRangedatabyid = async (req, res) => {
  const data = await IP_Pool.findOne({ netLabel: req.body.netLabel });
  res.json(data);
}

export const getNetworkLabel = async (req, res) => {

  const data = await IP_Pool.find().exec();

  var NetLables = [];

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].IP_range.length; j++) {
      if (data[i].IP_range[j]['key'] === "unassigned") {
        NetLables.push(data[i].netLabel);
      }
    }
  }

  let dup = [...new Set(NetLables)];

  const Labelsdata = dup;

  res.json(Labelsdata);

}
  

