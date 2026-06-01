import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 10000,
  },
  amount: { // Represents "Amount Paid"
    type: Number,
    required: true,
  },
  remainingBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Pending',
  },
  date: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
