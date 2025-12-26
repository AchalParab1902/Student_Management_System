import express from 'express';
import { login, logout, refreshToken, signupStudent, signupInstructor, forgotPassword, verifyOtp, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/student/signup', signupStudent);
router.post('/instructor/signup', signupInstructor);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
