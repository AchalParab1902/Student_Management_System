import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mobile: { type: String, required: true },
  instructorId: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Instructor = mongoose.model('Instructor', instructorSchema);
