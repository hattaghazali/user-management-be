import mongoose from "mongoose";
import configs from "./configs";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("LOG: Already connected to MongoDB");
      return;
    }

    const db_connection = await mongoose.connect(configs.mongo_url, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("LOG: Connected to MongoDB! Version ", db_connection.version);
  } catch (error) {
    console.error("LOG: DB Connection Error! ", error);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

export default connectDB;
