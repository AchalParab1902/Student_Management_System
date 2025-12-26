import express from 'express';
import { getUsers, toggleUserStatus, deleteUser } from '../controllers/admin.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/users', verifyAccessToken, allowRoles('Admin'), getUsers);
router.patch('/user/:id/toggle-status', verifyAccessToken, allowRoles('Admin'), toggleUserStatus);
router.delete('/user/:id', verifyAccessToken, allowRoles('Admin'), deleteUser);

export default router;
