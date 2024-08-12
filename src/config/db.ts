import mongoose from 'mongoose';
import { config } from "dotenv";

config();

let db: mongoose.Connection;

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
          
        });
        db = mongoose.connection;
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to DB", error);
    }
}

export { db };
