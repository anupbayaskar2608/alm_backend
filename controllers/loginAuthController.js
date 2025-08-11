import User from "../models/User.js";
import Region from "../models/Region.js";
import Department from "../models/Department.js";
import Application from "../models/Application.js";
import Security_Group from "../models/SecurityGroup.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../models/Role.js";
import { ObjectId } from 'mongodb';
//import auth from "../middleware/authController.js";


export const loginUser = async (req, res, next) => {

  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check if password is correct using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is incorrect, return an error
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    const fullName = user.fname + " " + user.lname;

    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
      fullName: fullName
    };

    const accessToken = jwt.sign({
      userId: user._id,
      role: user.role,
      email: user.email,
      fullName: fullName
    }, process.env.ACCESS_TOKEN_SECRET)

    const header = { alg: 'HS256', typ: 'JWT'};

    // const base64UrlHeader = base64url(JSON.stringify(header));
    // const base64UrlPayload = base64url(JSON.stringify(payload));
    // const signature = jwt.sign({payload}, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256' });
    // const base64UrlSignature = base64url(signature);

    console.log(accessToken);

    const refreshToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET);

    // Store tokens as HTTP-only cookies with secure flags and same-site policies   
    res.cookie('jwt_refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

    // Send a success response with tokens in the payload
    res.status(200).json({ message: 'Logged in successfully', accessToken });
    
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const myAccount = async (req, res, next) => {

  let id;

  try {

    // console.log(req.params.id);
    console.log(req.user);
    id = req.params.id;

    // create a new ObjectId from the id string
    const objectId = new ObjectId(id);
    const userdata = await User.findById(objectId);

    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: `User not found for ID: ${req.params.id}`
      });
    }

    return res.status(200).json({ success: true, userdata });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error while getting user by ID', error: error.message });
  }
};

//get back to Dashboard
export const getHome = async (req, res, next) => {
  try {
    const [

      { count: countApplications },
      { count: countRegions },
      { count: countDepartments },
      { count: countSecurityGroups },
      { count: countUsers },

    ] = await Promise.all([
      Application.countDocuments({ isDeleted: false }),
      Region.countDocuments({ isDeleted: false }),
      Department.countDocuments({ isDeleted: false }),
      Security_Group.countDocuments({ isDeleted: false }),
      User.countDocuments({ isDeleted: false }),
    ]);

    res.status(200).json({ countApplications, countRegions, countDepartments, countSecurityGroups, countUsers });

  } catch (error) {
    next(error);
  }
};
