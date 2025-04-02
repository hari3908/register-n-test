
const express = require('express');
const TestCase = require('../models/TestCase');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/testcases
// @desc    Create a new test case
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, steps, expectedResult, status, projectId } = req.body;

    const testCase = await TestCase.create({
      title,
      description,
      steps,
      expectedResult,
      status,
      projectId,
      userId: req.user._id,
    });

    res.status(201).json(testCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/testcases/project/:projectId
// @desc    Get all test cases for a project
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const testCases = await TestCase.find({
      projectId: req.params.projectId,
      userId: req.user._id,
    });
    res.json(testCases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
