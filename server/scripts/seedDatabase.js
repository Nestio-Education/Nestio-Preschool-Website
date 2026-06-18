import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Teacher.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data...');

    // Sample Teachers Data (Profile & Dashboard Info)
    const sampleTeachers = [
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@school.com',
        password: 'password123',
        phone: '9876543210',
        subject: 'Mathematics',
        grade: '10th',
        center: 'Main Campus',
        qualifications: 'B.Tech, M.Ed',
        experienceYears: 8,
        bio: 'Experienced math teacher with passion for student success',
        active: true
      },
      {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'priya.singh@school.com',
        password: 'password123',
        phone: '9876543211',
        subject: 'English',
        grade: '9th',
        center: 'North Campus',
        qualifications: 'B.A, M.Ed',
        experienceYears: 6,
        bio: 'Creative English teacher focused on literature and communication',
        active: true
      },
      {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@school.com',
        password: 'password123',
        phone: '9876543212',
        subject: 'Science',
        grade: '11th',
        center: 'South Campus',
        qualifications: 'B.Sc, M.Sc, B.Ed',
        experienceYears: 10,
        bio: 'Science educator with research background',
        active: true
      },
      {
        firstName: 'Sneha',
        lastName: 'Sharma',
        email: 'sneha.sharma@school.com',
        password: 'password123',
        phone: '9876543213',
        subject: 'History',
        grade: '8th',
        center: 'East Campus',
        qualifications: 'B.A, B.Ed',
        experienceYears: 5,
        bio: 'History enthusiast making past come alive for students',
        active: true
      },
      {
        firstName: 'Vikram',
        lastName: 'Verma',
        email: 'vikram.verma@school.com',
        password: 'password123',
        phone: '9876543214',
        subject: 'Computer Science',
        grade: '12th',
        center: 'Tech Hub',
        workingCenter: 'Tech Hub',
        qualifications: 'B.Tech CS, B.Ed',
        experienceYears: 7,
        bio: 'Tech-savvy instructor teaching programming and web development',
        status: 'approved',
        joined: new Date('2026-01-10'),
        attendance: 91,
        classes: 6,
        students: 48,
        batch: 'Batch C',
        active: true
      },
      {
        firstName: 'Shyam',
        lastName: 'Patil',
        email: 'shyam@spacece.in',
        password: 'swejal',
        phone: '9876500000',
        subject: 'English',
        grade: '10th',
        center: 'Main Campus',
        workingCenter: 'Main Campus',
        qualifications: 'M.A. English, B.Ed',
        experienceYears: 5,
        bio: 'English teacher focused on language development and literacy',
        status: 'approved',
        joined: new Date('2026-02-15'),
        attendance: 93,
        classes: 7,
        students: 42,
        batch: 'Batch A',
        active: true
      }
    ];

    for (const teacher of sampleTeachers) {
      teacher.password = await bcrypt.hash(teacher.password, 10);
    }

    const teachers = await Teacher.insertMany(sampleTeachers);

    console.log(`✓ Created ${teachers.length} teacher records`);

    const today = new Date();
    const attendanceRecords = [];

    const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'excused'];

    for (const teacher of teachers) {
      for (let day = 0; day < 30; day++) {
        const attendanceDate = new Date(today);
        attendanceDate.setDate(today.getDate() - day);

        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        attendanceRecords.push({
          teacher: teacher._id,
          date: attendanceDate,
          status: randomStatus,
          note:
            randomStatus === 'absent'
              ? 'Sick leave'
              : randomStatus === 'late'
              ? 'Traffic delay'
              : ''
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`✓ Created ${attendanceRecords.length} attendance records`);

    // Display Summary
    console.log('\n📊 Database Seeding Summary:');
    console.log('================================');
    console.log(`Total Teachers: ${teachers.length}`);
    console.log(`Total Attendance Records: ${attendanceRecords.length}`);
    console.log('================================\n');

    // Display sample teacher data
    console.log('Sample Teacher Records:');
    teachers.forEach((teacher, index) => {
      console.log(`\n${index + 1}. ${teacher.firstName} ${teacher.lastName}`);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Subject: ${teacher.subject}`);
      console.log(`   Grade: ${teacher.grade}`);
      console.log(`   Center: ${teacher.center}`);
      console.log(`   Experience: ${teacher.experienceYears} years`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
