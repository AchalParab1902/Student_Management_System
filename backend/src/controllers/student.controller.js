import { Student } from '../models/Student.model.js';

export const getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', '-password');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};
