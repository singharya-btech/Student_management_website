import express from 'express';
import Course from '../models/Course.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ id: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, faculty, seats, status } = req.body;

  try {
    // Generate course ID (e.g., C105, C106...)
    const allCourses = await Course.find({});
    let nextId = 'C101';
    if (allCourses.length > 0) {
      const numbers = allCourses.map(c => {
        const match = c.id.match(/C(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxNum = Math.max(...numbers);
      nextId = `C${maxNum + 1}`;
    }

    const course = new Course({
      id: req.body.id || nextId,
      title,
      faculty,
      seats: seats || 30,
      status: status || 'Open',
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });

    if (course) {
      course.title = req.body.title || course.title;
      course.faculty = req.body.faculty || course.faculty;
      course.seats = req.body.seats !== undefined ? req.body.seats : course.seats;
      course.status = req.body.status || course.status;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });

    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
