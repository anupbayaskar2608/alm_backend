import Department from '../models/Department.js';
import User from '../models/User.js'
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import { ObjectId } from 'mongodb';

//Get All Departments which are not deleted
export const getAllDepartments = async (req, res) => {
  try {
    const list = await Department.aggregate([
      { "$match": { "isDeleted": false } },

      {
        $lookup:
        {
          from: "users",
          localField: "dept_members.user_id",
          foreignField: "user_id",
          as: "item1",
        }
      },
      {
        $project:
        {
          "_id": 1,
          "department_name": 1,
          "dept_head": 1,
          "dept_members": 1,
          "deptMember": "$dept_members.user_id",
          "notes": 1,
          "members": "$item1"
        }
      }
    ]);

    const Users_List = await User.aggregate([
      { "$match": { "isDeleted": false } },
      {
        "$match": {
          "$and": [
            { "isDeleted": false },
            { "user_id": { "$ne": "US0001" } }
          ]
        }
      },
      {
        $project: {
          "fullname": { $concat: ["$fname", " ", "$lname"] },
          "user_id": 1
        }
      }
    ]);

    const deptCount = await Department.countDocuments({ isDeleted: false });

    if (list.length === 0) {
      res.status(200).json({
        departments: [],
        Users_List,
        deptCount

      });
    } else {
      res.status(200).json({
        departments: list,
        Users_List,
        deptCount

      });
    }
  } catch (error) {
    console.log("Error:" + error);
    res.status(500).json({
      message: 'Error getting departments'
    });
  }
};


//Create new Department
export const createDepartment = async (req, res) => {
  try {
    const { department_name, dept_members, dept_head, notes } = req.body;

    const departmentExist = await Department.findOne({
      department_name,
      isDeleted: false
    });

    if (departmentExist) {
      return res.status(400).json({ success: false, message: 'Department already exists'});
    }

    const members = dept_members.map((member) => ({
      user_id: member,
      key: 'Member'
    }));

    members.push({ user_id: dept_head, key: 'Department_Head' });

    const newId = await generatePrefixId('DT', 4, Department, 'dept_id');

    const newDepartment = new Department({
      dept_id: newId,
      department_name,
      dept_members: members,
      notes
    });

    const savedDepartment = await newDepartment.save();

    res.status(201).json({ success: true, message: 'Department created successfully', department: savedDepartment});
    

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error while creating department'
    });
  }
};

//Modify/Update Department which is present in database
export const updateDepartment = async (req, res, next) => {
  try {


    const id = req.params.id;
    const data = req.body;
    let members = [];

    for (let i = 0; i < data.dept_membersedit.length; i++) {
      members.push({ user_id: data.dept_membersedit[i], key: "Member" });
    }

    members.push({ user_id: data.dept_headedit, key: "Department_Head" });

    let department = await Department.findByIdAndUpdate(id, {
      department_name: data.department_name,
      dept_members: members,
      notes: data.notes
    }, { new: true });

    if (!department) return res.status(404).send('Department with the given id not found');
    // Return the updated department to the client
    res.status(200).json({
      success: true,
      department: department
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while updating department'
    });
  }
};


// Get a single Department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('dept_members.user_id', 'username email'); //populate user details
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while getting department by ID'
    });
  }
};



//Delete a single Department
export const deleteDepartment = async (req, res, next) => {
  let id;
  try {
    id = req.params.id;

    // create a new ObjectId from the id string
    const objectId = new ObjectId(id);

    const department = await Department.findById(objectId);

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await Department.softDelete(objectId);
    const message = `${department.department_name} department has been deleted.`;

    res.json({ message });
  } catch (error) {
    console.error(`Error deleting department with id ${id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};



