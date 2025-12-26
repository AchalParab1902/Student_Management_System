import { User } from '../models/User.model.js';
import { Student } from '../models/Student.model.js';
import { Instructor } from '../models/Instructor.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authService } from '../services/auth.service.js';
import { validateEmail, validatePassword, validateOtp, validateRefreshToken } from '../utils/validation.js';

export const signupStudent = async (req, res, next) => {
  try {
    const { name, email, mobile, rollNo, division, password, confirmPassword } = req.body;

    // 1. Validate all required fields
    if (!name || !email || !mobile || !rollNo || !division || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters and contain uppercase, number, and special character"
      });
    }

    // 3. If password !== confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // 4. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Check if rollNo already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this Roll No already exists"
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create User document FIRST
    console.log("Before User.create()");
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Student",
        isActive: true,
        loginCount: 0,
        lastLoginAt: null
      });
    } catch (err) {
      console.log("User creation failed:", err);
      return res.status(500).json({
        success: false,
        message: "User creation failed"
      });
    }
    console.log("After User.create()");

    // 8. Create Student document
    try {
      await Student.create({
        user: user._id,
        mobile,
        rollNo,
        division
      });
      console.log("After Student.create()");
    } catch (err) {
      // 9. Rollback: Delete created User
      await User.findByIdAndDelete(user._id);
      console.log("Student profile creation failed, User rolled back:", err);
      
      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate key error: Roll No or other unique field already exists"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Student profile creation failed"
      });
    }

    // 10. On success
    res.status(201).json({
      success: true,
      message: "Student registered successfully"
    });
  } catch (err) {
    next(err);
  }
};

export const signupInstructor = async (req, res, next) => {
  try {
    const { name, email, mobile, instructorId, password, confirmPassword } = req.body;

    // 1. Validate all required fields
    if (!name || !email || !mobile || !instructorId || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters and contain uppercase, number, and special character"
      });
    }

    // 3. If password !== confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // 4. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create User document FIRST
    console.log("Before User.create() - Instructor");
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Instructor",
        isActive: true, // Default to true or false depending on business logic? Assuming true for now based on Student
        loginCount: 0,
        lastLoginAt: null
      });
    } catch (err) {
      console.log("User creation failed:", err);
      return res.status(500).json({
        success: false,
        message: "User creation failed"
      });
    }
    console.log("After User.create() - Instructor");

    // 8. Create Instructor document
    try {
      await Instructor.create({
        user: user._id,
        mobile,
        instructorId
      });
      console.log("After Instructor.create()");
    } catch (err) {
      // 9. Rollback: Delete created User
      await User.findByIdAndDelete(user._id);
      console.log("Instructor profile creation failed, User rolled back:", err);
      return res.status(500).json({
        success: false,
        message: "Instructor profile creation failed"
      });
    }

    // 10. On success
    res.status(201).json({
      success: true,
      message: "Instructor registered successfully"
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if hardcoded admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const admin = await User.findOne({ email, role: 'Admin' });
      if (admin) {
        const accessToken = generateAccessToken(admin);
        return res.json({
          success: true,
          user: admin,
          accessToken,
          role: 'Admin'
        });
      }
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if isActive false
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update login count and last login
    user.loginCount += 1;
    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      success: true,
      user,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = await authService.forgotPassword(email);
    
    await sendEmail({
      email,
      subject: 'Password Reset OTP',
      message: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!validateOtp(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP format" });
    }

    await authService.verifyOtp(email, otp);
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters and contain uppercase, number, and special character"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    await authService.resetPassword(email, newPassword);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    if (!validateRefreshToken(refreshToken)) {
      return res.status(400).json({ success: false, message: "Invalid refresh token format" });
    }

    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token is required" });
    }

    if (!validateRefreshToken(token)) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ _id: user.id, role: user.role });
      res.json({ accessToken });
    });
  } catch (err) {
    next(err);
  }
};
