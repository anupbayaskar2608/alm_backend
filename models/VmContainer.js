import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define VmContainer schema
const VmContainerSchema = new mongoose.Schema({
    vm_id: { type: String },
    vm_name: { type: String },
    host_ip: { type: String },
    vm_guest_os: { type: String },
    vm_network: { type: String },
    nic_ids: { type: Array, default: [] },
    NICs: { type: Number },
    notes: { type: String },
    createdAt: { type: String, default: () => new Date().toLocaleString() }
});

// Add soft delete plugin to VmContainer schema
VmContainerSchema.plugin(softDeletePlugin);

// Define VmContainer model
const VmContainer = mongoose.model("VmContainer", VmContainerSchema);

// Export VmContainer model
export default VmContainer;