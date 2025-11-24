/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const roles = require('../constants/roles');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');

dotenv.config();

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Lesson.deleteMany(),
      Enrollment.deleteMany(),
      Assignment.deleteMany(),
    ]);

    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@lms.dev',
      password: 'Password123!',
      role: roles.ADMIN,
    });

    const instructor = await User.create({
      fullName: 'Instructor Jane',
      email: 'instructor@lms.dev',
      password: 'Password123!',
      role: roles.INSTRUCTOR,
      bio: 'Seasoned educator with 10+ years of experience.',
    });

    const student = await User.create({
      fullName: 'Student Sam',
      email: 'student@lms.dev',
      password: 'Password123!',
      role: roles.STUDENT,
    });

    const course = await Course.create({
      title: 'Full-Stack JavaScript',
      description: 'Master Node.js, Express, and React with practical projects.',
      category: 'Web Development',
      level: 'intermediate',
      price: 0,
      isPublished: true,
      instructor: instructor._id,
      thumbnail: 'https://placehold.co/600x400',
    });

    await Lesson.insertMany([
      {
        course: course._id,
        title: 'Introduction to the Stack',
        content: 'Overview of Node, Express, MongoDB, and React.',
        order: 1,
      },
      {
        course: course._id,
        title: 'Building REST APIs',
        content: 'Hands-on guide to building clean APIs with Express.',
        order: 2,
      },
    ]);

    const assignment = await Assignment.create({
      course: course._id,
      title: 'API Design Challenge',
      description: 'Design endpoints for a course catalog.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalPoints: 100,
    });

    await Enrollment.create({
      course: course._id,
      student: student._id,
      progress: 10,
      status: 'active',
    });

    console.log('Seed data created:');
    console.log({
      admin: admin.email,
      instructor: instructor.email,
      student: student.email,
      course: course.title,
      assignment: assignment.title,
    });
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();

