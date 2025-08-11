import mongoose from "mongoose";
import db from "../models/dbPromise.js";
const Role = db.role;

const dbConnect = () => {  
    
    mongoose.connect(process.env.DB)
        .then(() => {
            console.log("Connected to MongoDB");
            return initial();
        })
        .then(() => {
            console.log("Initialization complete!");
        })
        .catch(err => {
            console.error("Connection error", err);
            process.exit();
        });
    
    mongoose.connection.on("connected", () => {
        console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to database: " + err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB connection disconnected");
    });
    process.on("SIGINT", () => {
        mongoose.connection.close()
            .then(() => {
                console.log("Mongoose default connection disconnected through app termination");
                process.exit(0);
            })
            .catch((err) => {
                console.error("Error while disconnecting from MongoDB:", err);
                process.exit(1);
            });
    });
    
  
}

const initial = () => {
    return Role.estimatedDocumentCount()
        .then(count => {
            if (count === 0) {
                return Promise.all([
                    new Role({ name: "user" }).save(),
                    new Role({ name: "moderator" }).save(),
                    new Role({ name: "admin" }).save()
                ]);
            }
        })
        .then(() => {
            console.log("Roles added successfully!");
        })
        .catch(err => {
            console.error("Error adding roles:", err);
        });
}
  
export default dbConnect;
