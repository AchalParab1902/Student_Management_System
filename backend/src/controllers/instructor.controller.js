import { Instructor } from '../models/Instructor.model.js';

export const getInstructorProfile = async (req, res, next) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id }).populate('user', '-password');
    if (!instructor) return res.status(404).json({ message: 'Instructor profile not found' });
    res.json(instructor);
  } catch (err) {
    next(err);
  }
};
