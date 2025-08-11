import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the schema for the "Applications" collection
const ApplicationTypeSchema = new mongoose.Schema({

    application_id: {
        type: String
    },

    apm_id: {
        type: String,
        required: true
    },

    application_name: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true
    },

    application_type: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true
    },

    application_facing_type: {
        type: String,
        required: true
    },

    application: {
        type: String,
        required: true
    },

    application_priority_type: {
        type: String,
        required: true
    },

    notes: {
        type: String,
        maxlength: 300,
        default: "NA"
    },
    createdAt: {
        type: String,
        default: () => new Date().toLocaleString()
    }

});

// Add soft-delete plugin to the schema
ApplicationTypeSchema.plugin(softDeletePlugin);

// Create a model for the "Applications" collection using the schema
const Application = mongoose.model("Applications", ApplicationTypeSchema);

// Export the model
export default Application;