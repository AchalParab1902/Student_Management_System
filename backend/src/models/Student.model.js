import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mobile: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  division: { type: String, required: true },
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
