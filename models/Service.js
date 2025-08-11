import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the Services schema
const ServicesSchema = new mongoose.Schema({

    service_id: {
        type: String,
        required: [true, 'Service ID is required']
    },

    service_name: {
        type: String,
        required: [true, 'Service Name is required'],
        maxlength: 100
    },

    ports: {
        type: Number,
        required: [true, 'Ports are required']
    },

    protocols: {
        type: String,
        required: [true, 'Protocols are required']
    },

    notes: {
        type: String,
        default: "NA"
    },

    createdAt: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

// Add soft-delete plugin to Services schema
ServicesSchema.plugin(softDeletePlugin);

// Create the Services model
const Service = mongoose.model("Service", ServicesSchema);

// Export the Services model
export default Service;