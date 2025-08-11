import mongoose from "mongoose"; 
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// create a new mongoose schema for Role
const RoleSchema = new mongoose.Schema({
    name: { 
        type: String, // field type is String
        unique: true, // field is unique
        required: true // field is required
    },
});

// add the soft-delete-plugin to the Role schema
RoleSchema.plugin(softDeletePlugin);

// create a mongoose model for Role based on the RoleSchema
const Role = mongoose.model("Role", RoleSchema);

// export the Role model
export default Role;