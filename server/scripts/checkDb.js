import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';

const run = async () => {
  try {
    await connectDB();

    const teacherCount = await Teacher.countDocuments();
    const attendanceCount = await Attendance.countDocuments();

    console.log('Teachers count:', teacherCount);
    console.log('Attendance count:', attendanceCount);

    const sampleTeachers = await Teacher.find().limit(5).lean();
    const sampleAttendances = await Attendance.find().limit(5).populate('teacher','firstName lastName email').lean();

    console.log('\nSample teachers:');
    sampleTeachers.forEach(t => {
      console.log(`- ${t.firstName} ${t.lastName} | ${t.email} | ${t.subject} | active:${t.active}`);
    });

    console.log('\nSample attendance records:');
    sampleAttendances.forEach(a => {
      const date = new Date(a.date).toISOString().split('T')[0];
      console.log(`- ${date} | ${a.status} | ${a.teacher?.firstName ?? a.teacher} ${a.teacher?.lastName ?? ''}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error checking DB:', err.message);
    process.exit(1);
  }
};

run();
