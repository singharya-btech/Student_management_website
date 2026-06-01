import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import Notice from '../models/Notice.js';

// Load Environment Variables
dotenv.config();

// Connect Database
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Import Data
const importData = async () => {
  try {
    await connectDB();

    console.log('Cleaning old database data...');

    await User.deleteMany();
    await Student.deleteMany();
    await Course.deleteMany();
    await Payment.deleteMany();
    await Attendance.deleteMany();
    await Notice.deleteMany();

    console.log('Creating Users...');

    // Admin User
    const users = [
      {
        username: 'admin',
        email: 'admin@university.edu',
        password: 'admin123',
        role: 'Admin',
      },
    ];

    // Create Student Users
    mockStudentsData.forEach((student) => {
      users.push({
        username: student.email.split('@')[0],
        email: student.email.toLowerCase(),
        password: 'student123',
        role: 'Student',
      });
    });

    // Save Users
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log('Users Seeded Successfully');

    // Seed Students
    await Student.insertMany(mockStudentsData);
    console.log('Students Seeded Successfully');

    // Seed Courses
    await Course.insertMany(mockCoursesData);
    console.log('Courses Seeded Successfully');

    // Seed Payments
    await Payment.insertMany(mockPaymentsData);
    console.log('Payments Seeded Successfully');

    // Seed Attendance
    const attendanceRecords = mockStudentsData.map((student) => ({
      studentId: student.id,
      name: student.name,
      present: student.id !== 'STU006',
      date: new Date().toISOString().split('T')[0],
    }));

    await Attendance.insertMany(attendanceRecords);

    console.log('Attendance Seeded Successfully');

    // Seed Notices
    await Notice.insertMany(mockNoticesData);

    console.log('Notices Seeded Successfully');

    console.log('Database Seeding Completed Successfully');

    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

importData();