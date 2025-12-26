import mongoose from 'mongoose';
import { User } from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const testModel = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const email = `testmodel${Date.now()}@example.com`;
    console.log(`Creating user with email: ${email}`);

    const user = await User.create({
      name: "Model Test",
      email: email,
      password: "hashedpassword",
      role: "Student",
      isOtpVerified: false // Explicitly testing this
    });

    console.log("User created successfully:", user._id);
    await User.findByIdAndDelete(user._id);
    console.log("User deleted.");
    process.exit(0);
  } catch (error) {
    console.error("Model Test Failed:", error);
    process.exit(1);
  }
};

testModel();
