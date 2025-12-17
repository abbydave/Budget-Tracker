import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const DB_NAME = process.env.DB_NAME 

    if (!MONGO_URI) {
      throw new Error("Add Mongo URI to .env");
    }

    await mongoose.connect(`${MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // optional but recommended
  }
};

export default connectDB;
