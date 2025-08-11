import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the Department schema
const DepartmentSchema = new mongoose.Schema({
  department_name: { type: String },
  dept_members: { type: Array, default: [] },
  dept_id: { type: String },
  notes: { type: String, default: "NA" },
  createdAt: { type: String, default: () => new Date().toLocaleString() }
});

// Add the soft delete plugin to the Department schema
DepartmentSchema.plugin(softDeletePlugin);

// Create the Department model from the schema
const Department = mongoose.model("Department", DepartmentSchema);

// Export the Department model
export default Department;