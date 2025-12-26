import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Student', 'Instructor'], required: true },
  isActive: { type: Boolean, default: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  isOtpVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date, default: null }, // Track last login timestamp
  loginCount: { type: Number, default: 0 },   // Track total login attempts/successes
  refreshToken: { type: String, default: null } // Store current refresh token
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
