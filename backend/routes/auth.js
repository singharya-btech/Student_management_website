import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (supports Admin or Student registration)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, role, name, phone, department, semester, gpa } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
    message: 'Email and password are required',
  });
}
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const emailPrefix = cleanEmail.split('@')[0];
    let uniqueUsername = emailPrefix;
    const usernameExists = await User.findOne({ username: uniqueUsername });
    if (usernameExists) {
      uniqueUsername = cleanEmail;
    }

    // 1. Create the User account
    const user = await User.create({
      username: uniqueUsername,
      email: cleanEmail,
      password,
      role: role || 'Student',
    });

    // 2. If registering as a Student, automatically create the Student profile in database
    if (user && user.role === 'Student') {
      const allStudents = await Student.find({});
      let nextId = 'STU001';
      if (allStudents.length > 0) {
        const numbers = allStudents.map(s => {
          const match = s.id.match(/STU(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        const maxNum = Math.max(...numbers);
        nextId = `STU${String(maxNum + 1).padStart(3, '0')}`;
      }

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
      const displayName = name || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      const avatarLetter = displayName.charAt(0).toUpperCase();

      await Student.create({
        id: nextId,
        name: displayName,
        email: cleanEmail,
        phone: phone || '+91 99999 99999',
        department: department || 'Computer Science',
        semester: Number(semester) || 1,
        gpa: Number(gpa) || 0.0,
        attendance: 100, // standard new student attendance
        fees_status: 'Pending', // standard new student fees status
        avatar: avatarLetter,
        color: randomColor,
        skills: [],
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token (supports JIT Auto-Registration for Gmail Students)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const cleanEmail = email ? email.trim() : '';
    const isGmail = cleanEmail.toLowerCase().endsWith('@gmail.com');

    // Find by email or username
    let user = await User.findOne({
      $or: [
        { email: cleanEmail.toLowerCase() },
        { username: cleanEmail }
      ]
    });

    // Just-In-Time Provisioning check: If Gmail student is not found, flag it for frontend details entry!
    if (!user && isGmail && role === 'Student') {
      return res.status(404).json({ message: 'NEW_STUDENT_DETECTED' });
    }

    if (user && (await user.matchPassword(password))) {
      // Enforce role matching constraints
      if (role && user.role !== role) {
        return res.status(401).json({ 
          message: `Access Denied: This account is a ${user.role}, please sign in under the correct role.` 
        });
      }

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
