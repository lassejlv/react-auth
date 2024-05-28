import mongoose from "mongoose";
import { env } from "./env";

try {
  await mongoose.connect(env.MONGO_URL);

  if (mongoose.connection.readyState === 1) {
    console.log("Connected to MongoDB");
  }
} catch (error) {
  console.error("Error connecting to MongoDB: ", error);
  process.exit(1);
}
