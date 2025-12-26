import { User } from '../models/User.model.js';
import { Student } from '../models/Student.model.js';
import { Instructor } from '../models/Instructor.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'Student') {
      await Student.findOneAndDelete({ user: user._id });
    } else if (user.role === 'Instructor') {
      await Instructor.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
