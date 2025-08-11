import AppAndVm from '../models/AppAndVM.js';
import Application from "../models/Application.js";
import Region from "../models/Region.js"
import Department from "../models/Department.js";
import User from "../models/User.js";
import Security_Group from "../models/SecurityGroup.js";
import VmContainer from '../models/VmContainer.js';
import {
    ObjectId
} from 'mongodb';

//Universally Unique Identifier (UUID)
import {
    v4 as uuidv4
} from 'uuid';

export const getAllAvmMappings = async (req, res, next) => {
    try {

        const apmId_List = await Application.find({}, {
            _id: 0,
            apm_id: true
        });

        const dbRegions = await Region.find({}, {
            _id: 0,
            region_name: true,
            region_id: true
        });

        const dbDepartments = await Department.find();

        const dbSecurity = await Security_Group.find({}, {
            _id: 0,
            security_group_name: true,
            secg_id: true
        });

        const dbAplication = await Application.find();

        const dbVMs = await VmContainer.find();

        const dbUsersList = await User.aggregate(
            [{
                    "$match": {
                        "isDeleted": false
                    }
                },

                {
                    "$match": {
                        "$and": [{
                                "isDeleted": false
                            },
                            {
                                "user_id": {
                                    "$ne": "US0001"
                                }
                            }
                        ]
                    }
                },

                {
                    $project: {
                        "fullname": {
                            $concat: ["$fname", " ", "$lname"]
                        },
                        "user_id": 1
                    }
                }
            ]
        );

        const list = await AppAndVm.aggregate([{
                "$match": {
                    "isDeleted": false
                }
            },
            {

                $lookup: {
                    from: "applications",
                    localField: "apm_id",
                    foreignField: "apm_id",
                    as: "APP"
                }
            },
            {
                $lookup: {
                    from: "vmcontainers",
                    localField: "mapped_vms.vm_id",
                    foreignField: "vm_id",
                    as: "VMs"
                }
            },
            {
                $lookup: {
                    from: "securitygroups",
                    localField: "secgrp",
                    foreignField: "secg_id",
                    as: "SG"
                }
            },
            {
                $lookup: {
                    from: "regions",
                    localField: "region",
                    foreignField: "region_id",
                    as: "R"
                }
            },
            {

                $lookup: {
                    from: "users",
                    localField: "owner_id",
                    foreignField: "user_id",
                    as: "User"
                }
            },

            {

                $lookup: {
                    from: "departments",
                    localField: "dept",
                    foreignField: "dept_id",
                    as: "DEPT"
                }
            },

            {
                $unwind: {
                    path: "$APP",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $unwind: {
                    path: "$DEPT",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$R",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$SG",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$User",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "apm_id": 1,
                    "region": 1,
                    "mapped_vms": 1,
                    "owner_id": 1,
                    "dept": 1,
                    "assigndby": 1,
                    "secgrp": 1,
                    "comments": 1,
                    "assignby": 1,
                    "requestID": 1,
                    "notes":1,

                    "faceapp": "$APP.application_facing_type",
                    "appname": "$APP.application_name",
                    "apptype": "$APP.application_type",

                    "application_owner_name": {
                        $concat: ["$User.fname", " ", "$User.lname"]
                    },
                    "appownemail": "$User.email",
                    "appowncontact": "$User.phone",

                    "department_members": "$DEPT.dept_members",
                    "mapped_vms1": "$mapped_vms.vm_id",
                    "regionName": "$R.region_name"
                    //"mapped_department_members": "$department_members.user_id"


                    // { $setIntersection: ["$dept_members.user_id", "$User.user_id"] }

                }
            }
        ]);

        const coutedAvmMappings = await AppAndVm.countDocuments({
            isDeleted: false
        });
        res.status(200).json({
            NetworkMappings: list,
            apmId_List,
            dbUsersList,
            coutedAvmMappings,
            dbRegions,
            dbDepartments,
            dbVMs,
            dbSecurity,
            dbAplication
        });
    } catch (error) {
        console.log("Error:" + error);
        res.status(500).json({
            message: 'Error getting Application Mappings'
        });
    }

}

export const createAppVmMapping = async (req, res, next) => {

    try {
        const appvm_uuid = uuidv4(); //Universally Unique Identifier (UUID)

        const data = req.body;

        let selected_vms = [];
        for (let i = 0; i < data.vm_id.length; i++) {
            selected_vms.push({
                vm_id: data.vm_id[i]
            });
        }

        let application_vm = new AppAndVm({
            AVID: appvm_uuid,

            apm_id: data.apm_id,
            region: data.region,
            dept: data.dept,
            owner_id: data.appown,

            secgrp: data.secgrp,
            assigndby: data.assigndby,
            requestID: data.requestID,
            mapped_vms: selected_vms,
            notes: data.comments
        })

        application_vm = await application_vm.save();
        res.status(201).json({
            success: true,
            message: 'App Mapping created successfully',
            department: application_vm
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error while creating App Mapping'
        });
    }

}

export const updateAppVmMapping = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let update_selected_vms = [];
        for (let i = 0; i < data.vm_id_edit.length; i++) {
            update_selected_vms.push({
                vm_id: data.vm_id_edit[i]
            });
        }

        let application_vm = await AppAndVm.findByIdAndUpdate(id, {

            apm_id: data.editapm_id,
            region: data.edit_region,
            dept: data.edit_dept,
            secgrp: data.edit_secgrp,
            owner_id: data.uappown,
            requestID: data.requestID,
            assigndby: data.assigndby,
            mapped_vms: update_selected_vms,
            notes: data.comments

        }, {
            new: true
        });

        if (!application_vm) return res.status(404).send('Record not found');
        res.status(200).json({
            success: true,
            application_vm: application_vm
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while updating Application and VM mapping'
        });
    }
}

export const getAppVmMappingById = async (req, res, next) => {
    try {

        const application_vm = await AppAndVm.findById(req.params.id);
        if (!application_vm) {
            return res.status(404).json({
                success: false,
                message: 'Application and Vm mapping record not found'
            });
        }
        res.status(200).json({
            success: true,
            application_vm
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while getting Application and Vm mapping record by ID'
        });
    }
}

export const deleteAppVmMapping = async (req, res, next) => {
    let id;
    try {

        id = req.params.id;
        const objectId = new ObjectId(id);
        const application_vm = await AppAndVm.findById(objectId);

        if (!application_vm) {
            return res.status(404).json({
                error: 'Application Mapping not found'
            });
        }

        await AppAndVm.softDelete(objectId);
        const message = `${AppAndVm.apm_id} of Application Mapping has been deleted.`;

        res.json({
            message
        });

    } catch (error) {
        console.error(`Error deleting Application Mapping with id ${AppAndVm.apm_id}: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}

export const getAppdatabyID = async (req, res) => {
    const data = await Application.findOne({
        apm_id: req.body.id
    });
    res.json(data);
}

export const getUAppdatabyID = async (req, res) => {
    const data = await Application.findOne({
        apm_id: req.body.id
    });
    res.json(data);
}

export const getuserDataAppVMDatabyid = async (req, res) => {
    const data = await User.findOne({
        user_id: req.body.id
    });
    res.json(data);
}

export const getUpdateuserDataAppVMDatabyid = async (req, res) => {
    const data = await User.findOne({
        user_id: req.body.id
    });
    res.json(data);
}

export const getDeptHeadDatabyid = async (req, res) => {

    const data = await Department.findOne({
        dept_id: req.body.id
    });

    var Temp_Dept_head, Dept_head_Name = "";

    var Dept_Headname_Members_list = [];

    // TO get Department Head Name And Members list...
    for (var i = 0; i < data.dept_members.length; i++) {
        Dept_Headname_Members_list.push((await User.findOne({
            user_id: data.dept_members[i].user_id
        })));

        if (data.dept_members[i].key === "Department_Head") {
            Temp_Dept_head = (await User.findOne({
                user_id: data.dept_members[i].user_id
            }));
            Dept_head_Name = (Temp_Dept_head.fname + " " + Temp_Dept_head.lname);
        }
    }

    Dept_Headname_Members_list.push({
        Department_Head: Dept_head_Name
    });

    //console.log("on update " + Dept_Headname_Members_list);

    res.json(Dept_Headname_Members_list);

}

export const getUpdateDeptHeadDatabyid = async (req, res) => {

    const data = await Department.findOne({
        dept_id: req.body.id
    });

    var Temp_Dept_head, Dept_head_Name = "";

    var updated_dept_Headname_Members_list = [];

    // TO get Department Head Name And Members list...
    for (var i = 0; i < data.dept_members.length; i++) {
        updated_dept_Headname_Members_list.push((await User.findOne({
            user_id: data.dept_members[i].user_id
        })));

        if (data.dept_members[i].key === "Department_Head") {
            Temp_Dept_head = (await User.findOne({
                user_id: data.dept_members[i].user_id
            }));
            Dept_head_Name = (Temp_Dept_head.fname + " " + Temp_Dept_head.lname);
        }
    }

    updated_dept_Headname_Members_list.push({
        Department_Head: Dept_head_Name
    });

    //console.log("on update " + updated_dept_Headname_Members_list);

    res.json(updated_dept_Headname_Members_list);

}