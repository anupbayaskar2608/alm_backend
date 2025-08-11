// Importing mongoose and soft-delete-plugin-mongoose
import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Creating a new schema for Region
const RegionSchema = new mongoose.Schema({
  
  // Region name field with required validation and a max length of 100 characters
  region_name: {
    type: String,
    required: [true, 'Region name is required'],
    maxlength: 100
  },

  // Region ID field with required validation
  region_id: {
    type: String,
    required: [true, 'Region ID is required']
  },

  // Postal address field with required validation, min length of 6 characters, and max length of 6 characters
  postal_address: {
    type: String,
    required: [true, 'Postal address is required'],
    minlength: 6,
    maxlength: 6
  },

  // Notes field with a default value of "NA"
  notes: {
    type: String,
    default: "NA"
  },

  // createdAt field with a default value of the current date and time
  createdAt: {
    type: String,
    default: () => new Date().toLocaleString()
  }

});

// Adding the soft delete plugin to the Region schema
RegionSchema.plugin(softDeletePlugin);

// Creating a new model for Region using the Region schema
const Region = mongoose.model("Region", RegionSchema);

// Exporting the Region model
export default Region;
