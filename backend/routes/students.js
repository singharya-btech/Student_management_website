import express from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all students
// @route   GET /api/students
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find({}).sort({ id: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Try finding by internal STUxxx ID, or Mongoose _id
    const student = await Student.findOne({
      $or: [
        { id: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined }
      ].filter(Boolean)
    });

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, email, phone, department, semester, gpa, attendance, fees_status, skills, enrollment_date, status } = req.body;

  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Auto-generate next STUxxx ID
    const allStudents = await Student.find({});
    let nextId = 'STU001';
    if (allStudents.length > 0) {
      // Find the highest STU number
      const numbers = allStudents.map(s => {
        const match = s.id.match(/STU(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxNum = Math.max(...numbers);
      nextId = `STU${String(maxNum + 1).padStart(3, '0')}`;
    }

    // Select a color and avatar
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-indigo-500 to-purple-500',
      'from-red-500 to-orange-500',
      'from-green-500 to-emerald-500',
      'from-amber-500 to-yellow-500',
      'from-sky-500 to-blue-500',
      'from-violet-500 to-purple-500'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const avatarLetter = name.charAt(0).toUpperCase();

    const student = new Student({
      id: nextId,
      name,
      email,
      phone,
      department,
      semester: semester || 1,
      gpa: gpa || 0.0,
      attendance: attendance || 100,
      fees_status: fees_status || 'Pending',
      avatar: avatarLetter,
      color: randomColor,
      skills: skills || [],
      enrollment_date: enrollment_date || new Date().toISOString().split('T')[0],
      status: status || 'Active',
    });

    const createdStudent = await student.save();

    // Automatically create corresponding User credentials with unique username handling
    const emailPrefix = email.split('@')[0];
    let uniqueUsername = emailPrefix;
    const usernameExists = await User.findOne({ username: uniqueUsername });
    if (usernameExists) {
      uniqueUsername = email.toLowerCase(); // fallback to full email which is guaranteed unique
    }

    await User.create({
      username: uniqueUsername,
      email: email.toLowerCase(),
      password: 'student123', // Default password
      role: 'Student'
    });

    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOne({
      $or: [
        { id: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined }
      ].filter(Boolean)
    });

    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.phone = req.body.phone || student.phone;
      student.department = req.body.department || student.department;
      student.semester = req.body.semester !== undefined ? req.body.semester : student.semester;
      student.gpa = req.body.gpa !== undefined ? req.body.gpa : student.gpa;
      student.attendance = req.body.attendance !== undefined ? req.body.attendance : student.attendance;
      student.fees_status = req.body.fees_status || student.fees_status;
      student.skills = req.body.skills || student.skills;
      student.status = req.body.status || student.status;
      student.enrollment_date = req.body.enrollment_date || student.enrollment_date;
      
      // Update avatar letter if name changes
      if (req.body.name) {
        student.avatar = req.body.name.charAt(0).toUpperCase();
      }

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOne({
      $or: [
        { id: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined }
      ].filter(Boolean)
    });

    if (student) {
      // Automatically clean up corresponding User credentials
      await User.deleteOne({ email: student.email });
      await student.deleteOne();
      res.json({ message: 'Student and credentials removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
