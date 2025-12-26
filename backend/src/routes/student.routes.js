import express from 'express';
import { getStudentProfile } from '../controllers/student.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/profile', verifyAccessToken, allowRoles('Student'), getStudentProfile);

export default router;
