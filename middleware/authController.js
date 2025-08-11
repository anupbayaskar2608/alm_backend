import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import jwtDecode from 'jwt-decode';

// Function to generate an access token
const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

// Function to generate a refresh token
const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

// Middleware function to authenticate a user's access token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization);
    console.log("AuthHeader: " + authHeader);

    const accessToken = authHeader && authHeader.split(' ')[1];
    console.log("Authentication Middleware: " + accessToken + " Type: " + typeof (accessToken));

    if (!accessToken) {
      return res.status(401).send('Unauthorized');
    }

    // Verify the access token using the access token secret
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("DecodedToken: " + decodedToken);

    // Get the user from the decoded token's user ID
    const user = await User.findById(decodedToken.payload.userId);

    if (!decodedToken.payload) {
      return next();
    }

    // Add user information to the response locals for use in subsequent middleware and routes
    const { fname, lname, email, role } = user;
    res.locals.fullName = `${fname} ${lname}`;
    res.locals.userMail = email;
    res.locals.userId = user._id;
    res.locals.role = role;

    return next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    // If there is an error, set user information to null and continue to next middleware/route
    res.locals.fullName = null;
    res.locals.userId = null;
    res.locals.userMail = null;
    res.locals.role = null;
    return next();
  }
};

// Function to verify a refresh token
const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) => {
    // Verify the refresh token using the refresh token secret
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) reject('Invalid refresh token');
      resolve(user);
    });
  });

export default {
  generateAccessToken,
  generateRefreshToken,
  authenticateUser,
  verifyRefreshToken
};
