import express from 'express';
import Notice from '../models/Notice.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const notice = new Notice({
      title,
      content,
      category: category || 'Announcement',
      postedBy: req.user.username, // Automatically capture the posting admin's username
    });

    const createdNotice = await notice.save();
    res.status(201).json(createdNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      await notice.deleteOne();
      res.json({ message: 'Notice removed successfully' });
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
