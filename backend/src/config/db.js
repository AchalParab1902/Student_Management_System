import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`SUCCESS: MongoDB Connected: ${conn.connection.host}`);

        // Seed Admin if not exists
        const adminExists = await User.findOne({ role: 'Admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await User.create({
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'Admin'
            });
            console.log('SUCCESS: Hardcoded Admin user seeded');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
