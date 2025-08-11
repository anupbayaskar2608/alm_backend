import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the schema for the IP pool collection
const IP_poolSchema = new mongoose.Schema({
  pool_id: { type: String },
  netLabel: { type: String },
  IP_poolAddr: { type: String }, // IP address within pool.
  subnetMask: { type: String },
  CIDR: { type: String },
  vlanID: { type: String },
  gateway: { type: String },
  noOfHosts: { type: String },
  notes: { type: String },
  Overlay_Network: { type: Boolean, default: false },
  IP_range: { type: Array, default: [] },
  createdAt: { type: String, default: () => new Date().toLocaleString() }
});

// Add the soft delete plugin to the schema
IP_poolSchema.plugin(softDeletePlugin);

// Create a model for the IP pool collection using the schema
const IP_pool = mongoose.model("IP_pool", IP_poolSchema);

// Export the IP pool model
export default IP_pool;