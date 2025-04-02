
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  steps: {
    type: String,
    trim: true
  },
  expectedResult: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Passed', 'Failed', 'Blocked', 'Not Run'],
    default: 'Not Run'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;
