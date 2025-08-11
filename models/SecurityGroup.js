import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the schema for the SecurityGroup collection
const SecurityGroupSchema = new mongoose.Schema({
    
    security_group_name: {
        type: String,
        maxlength: 100,
        required: [true, 'security group name ID is required'] // Make this field required with a custom error message
    },

    secg_id: {
        type: String // Define the type for this field
    },

    services: {
        type: Array,
        default: [] // Set the default value for this field to an empty array
    },

    notes: {
        type: String,
        default: "NA" // Set the default value for this field to "NA"
    },

    createdAt: {
        type: String,
        default: () => new Date().toLocaleString() // Set the default value for this field to the current date and time
    }
});

// Use the soft-delete-plugin for Mongoose
SecurityGroupSchema.plugin(softDeletePlugin);

// Create the SecurityGroup model using the SecurityGroupSchema
const SecurityGroup = mongoose.model("SecurityGroup", SecurityGroupSchema);

// Export the SecurityGroup model
export default SecurityGroup;