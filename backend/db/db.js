import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'));
  } catch (error) {
    console.log('MongoDB connection failed: ', error)
    process.exit(1)
  }
}
