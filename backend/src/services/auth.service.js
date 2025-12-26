import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { Student } from '../models/Student.model.js';
import { Instructor } from '../models/Instructor.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import { generateOtp } from '../utils/otpGenerator.js';

export const authService = {
  registerStudent: async (data) => {
    const { name, email, mobile, rollNo, division, password } = data;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'Student',
      isActive: true,
      lastLoginAt: null,   // Initial login-related data
      loginCount: 0, 
      refreshToken: null 
    });
    
    const student = await Student.create({ user: user._id, mobile, rollNo, division });
    
    return { user, student };
  },

  registerInstructor: async (data) => {
    const { name, email, mobile, instructorId, password } = data;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'Instructor',
      isActive: true,
      lastLoginAt: null,   // Initial login-related data
      loginCount: 0, 
      refreshToken: null 
    });
    
    const instructor = await Instructor.create({ user: user._id, mobile, instructorId });
    
    return { user, instructor };
  },

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    if (!user.isActive) {
      throw new Error('Account deactivated');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ 
      token: refreshToken, 
      user: user._id, 
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

    return { user, accessToken, refreshToken };
  },

  forgotPassword: async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    
    // Admin password reset not supported via OTP for security reasons or specific requirement
    if (user.role === 'Admin') throw new Error('Admin password reset not supported via OTP');

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    user.isOtpVerified = false;
    await user.save();

    return otp;
  },

  verifyOtp: async (email, otp) => {
    const user = await User.findOne({ 
      email, 
      otpExpiry: { $gt: Date.now() } 
    });
    
    if (!user) throw new Error('Invalid or expired OTP');

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new Error('Invalid or expired OTP');

    user.isOtpVerified = true;
    await user.save();

    return user;
  },

  resetPassword: async (email, newPassword) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    if (!user.isOtpVerified) {
      throw new Error('OTP verification required before password reset');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isOtpVerified = false; // Reset the flag
    await user.save();
  }
};
