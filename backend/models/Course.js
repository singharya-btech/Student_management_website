import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  faculty: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: Number,
    required: true,
    default: 30,
  },
  status: {
    type: String,
    enum: ['Open', 'Almost full', 'New'],
    default: 'Open',
  },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
