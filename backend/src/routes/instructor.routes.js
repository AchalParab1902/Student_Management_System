import express from 'express';
import { getInstructorProfile } from '../controllers/instructor.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/profile', verifyAccessToken, allowRoles('Instructor'), getInstructorProfile);

export default router;
