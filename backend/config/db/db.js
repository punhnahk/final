import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.DATABASE_URL;
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connect DB`);
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
