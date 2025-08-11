import mongoose from "mongoose";

// Define a new Mongoose schema
const Schema = mongoose.Schema;

// Define a schema for user tokens
const userTokenSchema = new Schema({
  // The ID of the user associated with this token
  userId: { type: Schema.Types.ObjectId, required: true },

  // The token string itself
  token: { type: String, required: true },

  // The creation time of the token, with an expiration time of 30 days
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

// Create a new Mongoose model based on the schema
const UserToken = mongoose.model("UserToken", userTokenSchema);

// Export the model for use in other files
export default UserToken;