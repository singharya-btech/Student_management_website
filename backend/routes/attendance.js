import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get attendance sheet for a specific date
// @route   GET /api/attendance
// @access  Private
router.get('/', protect, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    // Find attendance records for the given date
    let records = await Attendance.find({ date });

    // If no records exist for this date, build a default checklist using current students
    if (records.length === 0) {
      const students = await Student.find({ status: 'Active' });
      records = students.map(student => ({
        studentId: student.id,
        name: student.name,
        present: true, // Default to present
        date: date
      }));
    }

    // Calculate dynamic presence percentage
    const presentCount = records.filter(r => r.present).length;
    const totalCount = records.length;
    const percent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

    res.json({
      records,
      percent,
      date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Save/update attendance sheet for a specific date
// @route   POST /api/attendance
// @access  Private
router.post('/', protect, async (req, res) => {
  const { date, records } = req.body; // records: [{ studentId, name, present }]

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ message: 'Invalid records array' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    // Delete existing records for this date to avoid duplicates
    await Attendance.deleteMany({ date: targetDate });

    // Insert new records
    const attendanceRecords = records.map(r => ({
      studentId: r.studentId,
      name: r.name,
      present: !!r.present,
      date: targetDate
    }));

    const savedRecords = await Attendance.insertMany(attendanceRecords);

    // Optionally update each student's overall attendance percentage dynamically
    // Let's compute overall average attendance per student and save it!
    for (const record of records) {
      const studentId = record.studentId;
      const allStudentLogs = await Attendance.find({ studentId });
      if (allStudentLogs.length > 0) {
        const presents = allStudentLogs.filter(l => l.present).length;
        const studentPercent = Math.round((presents / allStudentLogs.length) * 100);
        
        await Student.findOneAndUpdate({ id: studentId }, { attendance: studentPercent });
      }
    }

    res.status(201).json({
      message: 'Attendance saved successfully',
      records: savedRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get attendance history for a specific student
// @route   GET /api/attendance/student/:studentId
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const history = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
