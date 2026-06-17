import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, required: true, trim: true },
    email:           { type: String, required: true, trim: true, lowercase: true, unique: true },
    password:        { type: String, trim: true, default: '' },
    phone:           { type: String, trim: true },
    subject:         { type: String, trim: true },
    grade:           { type: String, trim: true },
    center:          { type: String, trim: true },
    workingCenter:   { type: String, trim: true, default: '' },
    qualifications:  { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    bio:             { type: String, trim: true },
    status:          { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    joined:          { type: Date, default: Date.now },
    attendance:      { type: Number, default: 0 },
    classes:         { type: Number, default: 0 },
    students:        { type: Number, default: 0 },
    batch:           { type: String, trim: true, default: '' },
    active:          { type: Boolean, default: true },
    schedule:        { type: Array, default: [] },
    grades:          { type: Array, default: [] },
    attendanceMonthly: { type: Array, default: [] },
    assignments:     { type: Array, default: [] },
    courses:         { type: Array, default: [] },
    certificates:    { type: Array, default: [] },
    notifications:   { type: Array, default: [] },
    portfolio: {
      degree:     { type: String, trim: true },
      university: { type: String, trim: true },
      netStatus:  { type: String, trim: true },
      netDesc:    { type: String, trim: true },
      expYears:   { type: String, trim: true },
      expBio:     { type: String, trim: true }
    }
  },
  {
    collection: 'teacher_dashboard',
    timestamps: true
  }
);

teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema, 'teacher_dashboard');

export default Teacher;