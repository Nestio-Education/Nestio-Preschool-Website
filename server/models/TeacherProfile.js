import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    teacherEmail: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    workingCenter: { type: String, trim: true },
    subject: { type: String, trim: true },
    batch: { type: String, trim: true },
    role: { type: String, default: 'teacher' },
    joined: { type: String, trim: true },
    attendance: { type: Number, default: 90 },
    portfolio: {
      degree: { type: String, trim: true },
      university: { type: String, trim: true },
      netStatus: { type: String, trim: true },
      netDesc: { type: String, trim: true },
      expYears: { type: String, trim: true },
      expBio: { type: String, trim: true }
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: 'English' }
    },
    passwordHash: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String }
  },
  {
    collection: 'teacher_profile',
    timestamps: true
  }
);

const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema, 'teacher_profile');
export default TeacherProfile;
