import User from '../models/User.js';
import Role from '../models/Role.js'
import generatePrefixId from "../middleware/prefixIdGenerator.js";
import bcrypt from 'bcryptjs';
import prompt from 'prompt';


export async function defaultUser() {
    try {
      const count = await User.estimatedDocumentCount({}, { maxTimeMS: 30000 });
      if (count === 0) {
       
        console.log('Default user not found. Creating default user...');
  
       // const properties = [{
       //   name: 'password',
       //   description: 'Enter password for admin account',
       //   hidden: true,
       //  replace: '*',
       //   required: true
       // }];

        const password = "password";
  
        //const { password } = await prompt.get(properties);
          const hashPassword = await bcrypt.hash(password, 10);
          
        await new User({
          user_id: 'US0001',
          fname: 'admin',
          lname: ' ',
          username: 'administrator@alm.local',
          email: 'admin@alm.in',
          phone: '0000000000',
          password: hashPassword,
          gender: 'Male',
          role: 'admin',
          usertype: 'BOSS'
        }).save();
  
        console.log('Default user created successfully. You can now log in with the following credentials:');
        console.log('- Username: administrator@alm.local');
      
      } else {
        console.log('Default user already exists.');
      }
    } catch (error) {
      console.error('Error in creating default user:', error);
    }
  }
  

// Get all users who are not deleted
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            isDeleted: false
        });
        const dbRoles = await Role.find({}, {
            _id: 0,
            name: 1
        });

        res.status(200).json({
            users: users,
            dbRoles: dbRoles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error getting users'
        });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const {
        fname,
        lname,
        username,
        usertype,
        email,
        phone,
        password,
        gender,
        role,
        notes
    } = req.body;

    if (await isUserExists(username)) {
        return res.status(400).json({
            success: false,
            message: 'Username already exists'
        });
    }

    if (await isEmailExists(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists'
        });
    }

    if (await isPhoneExists(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Phone number already exists'
        });
    }

    const newId = await generatePrefixId('US', 4, User, 'user_id');
    try {
        const newUser = new User({
            user_id: newId,
            fname: fname,
            lname: lname,
            username: username,
            usertype: usertype,
            email: email,
            phone: phone,
            password: password,
            gender: gender,
            role: role,
            notes: notes
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating user'
        });
    }
};
// Check if a user exists with the given username and is not deleted
async function isUserExists(username) {
    try {
        const userExist = await User.findOne({
            username: username,
            isDeleted: false
        });
        return !!userExist;
    } catch (error) {
        console.error(`Error checking if user ${username} exists: ${error.message}`);
        return false;
    }
}

// Check if a user exists with the given email and is not deleted
async function isEmailExists(email) {
    try {
        const emailExist = await User.findOne({
            email: email,
            isDeleted: false
        });
        return !!emailExist;
    } catch (error) {
        console.error(`Error checking if email ${email} exists: ${error.message}`);
        return false;
    }
}

// Check if a user exists with the given phone number and is not deleted
async function isPhoneExists(phone) {
    try {
        const phoneExist = await User.findOne({
            phone: phone,
            isDeleted: false
        });
        return !!phoneExist;
    } catch (error) {
        console.error(`Error checking if phone number ${phone} exists: ${error.message}`);
        return false;
    }
}

// Get a single user by its user_id field
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            user_id: req.params.id,
            isDeleted: false
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while getting user'
        });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        // Find the user by their user_id
        const user = await User.findOne({
            _id: req.params.id
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Soft delete the user
        user.isDeleted = true;
        await user.save();

        // Return success message to the client
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while deleting user'
        });
    }
};

// Update an existing user by ID
export const updateUserById = async (req, res) => {
    const {
        fname,
        lname,
        username,
        usertype,
        email,
        phone,
        password,
        gender,
        role,
        notes
    } = req.body;
    try {
        let user = await User.findOne({
            user_id: req.params.id
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check if new username or email already exists in database
        if (username && username !== user.username && await isUserExists(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        if (email && email !== user.email && await isEmailExists(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Update user fields
        user.fname = fname || user.fname;
        user.lname = lname || user.lname;
        user.username = username || user.username;
        user.usertype = usertype || user.usertype;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.password = password || user.password;
        user.gender = gender || user.gender;
        user.role = role || user.role;
        user.notes = notes || user.notes;

        const savedUser = await user.save();
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while updating user'
        });
    }
};