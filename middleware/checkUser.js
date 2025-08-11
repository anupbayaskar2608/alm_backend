import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import UserModel from "../models/User.js";

export default async function authenticateUser(req, res, next) {
  try {
    // Get the token from the cookie
    const token = req.cookies["accessToken"];

    // If the token is not present, skip to the next middleware function
    if (!token) {
      return next();
    }
    // Decode the token to get the user ID
    const decodedToken = jwtDecode(token);

    // Find the user details using the user ID from the token
    const userDetails = await UserModel.findById(decodedToken.userId);

    // If no user details were found, skip to the next middleware function
    if (!userDetails) {
      return next();
    }
    // Extract the first name, last name, email, and role from the user details
    const { fname, lname, email, role } = userDetails;

    // Construct the full name from the first name and last name
    const fullName = `${fname} ${lname}`;

    // Set the user data in the response locals
    res.locals.fullName = fullName;
    res.locals.userMail = email;
    res.locals.userId = userDetails._id;
    res.locals.role = role;

    // Call the next middleware function
    return next();
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);

    // Set the user data to null in the response locals
    res.locals.fullname = null;
    res.locals.userId = null;
    res.locals.userMail = null;
    res.locals.role = null;

    // Call the next middleware function
    return next();
  }
};


