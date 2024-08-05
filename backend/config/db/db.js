import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function connectDB() {
  const url =
    "mongodb+srv://imhnahk:Noel2003@final.m2yps6r.mongodb.net/?retryWrites=true&w=majority&appName=final";
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
