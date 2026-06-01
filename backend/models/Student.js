import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: Number,
    required: true,
    default: 1,
  },
  gpa: {
    type: Number,
    required: true,
    default: 0.0,
  },
  attendance: {
    type: Number,
    required: true,
    default: 0,
  },
  fees_status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Pending',
  },
  avatar: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'from-purple-500 to-pink-500',
  },
  skills: {
    type: [String],
    default: [],
  },
  enrollment_date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
