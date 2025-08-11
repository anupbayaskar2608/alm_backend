import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  
  user_id: {
    type: String,
    required: [true, 'User ID is required'],    
  },

  fname: {
    type: String,
    required: [true, 'First name is required']
  },

  lname: {
    type: String,
    required: [true, 'Last name is required']
  },

  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },

  usertype: {
    type: String,
    required: [true, 'User type is required']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    minlength: 10,
    maxlength: 255,
    match: /^\S+@\S+\.\S+$/
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    maxlength: 1024
  },

  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ["Male", "Female", "Other"]
  },

  role: {
    type: String
  },

  notes: {
    type: String,
    default: "NA"
  },

  date: {
    type: String,
    default: () => new Date().toLocaleString()
  }
  
});

// Add the soft-delete plugin to the schema
userSchema.plugin(softDeletePlugin);

// Create the User model and export it
const User = mongoose.model("User", userSchema);
export default User;