const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  splitAmong: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    settled: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);