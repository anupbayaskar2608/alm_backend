import mongoose from "mongoose";
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

// Define the schema for the AV collection
const AVSchema = new mongoose.Schema({
  AVID: { type: String },
  apm_id: { type: String },
  owner_id: { type: String },
  region: { type: String },
  dept: { type: String },
  secgrp: { type: String },
  assigndby: { type: String },
  requestID: { type: Number },
  mapped_vms: { type: Array, "default": [] },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  createdAt: { type: String, default: () => new Date().toLocaleString() }
});

// Add the soft-delete plugin to the schema
AVSchema.plugin(softDeletePlugin);

// Create a model from the schema and export it
const AVM = mongoose.model("appvm", AVSchema);
export default AVM;
