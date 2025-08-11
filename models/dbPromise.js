import mongoose from "mongoose";
import UserModel from "./User.js";
import Role from "./Role.js";

mongoose.Promise    =   global.Promise;
const db            =    {};
db.mongoose         =   mongoose;
db.User             =   UserModel;
db.role             =   Role;

db.ROLES = ["user", "admin", "moderator"];

export default db;