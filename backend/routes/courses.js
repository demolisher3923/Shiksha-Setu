const express = require('express');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, teacherOrAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all courses with filters
router.get('/', async (req, res) => {
  try {
    const { 
      subject, 
      grade, 
      difficulty, 
      language, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };
    
    if (subject) filter.subject = subject;
    if (grade) filter.grade = parseInt(grade);
    if (difficulty) filter.difficulty = difficulty;
    if (language) {
      filter['multilingual.supportedLanguages'] = language;
    }
    
    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(filter)
      .populate('instructor', 'profile.firstName profile.lastName')
      .select('-chapters.lessons.content') // Exclude detailed content for list view
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(filter);

    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCourses / parseInt(limit)),
        totalCourses,
        hasNext: skip + courses.length < totalCourses,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      message: 'Error fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get single course with full details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'profile.firstName profile.lastName profile.avatar');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If user is authenticated, get their progress
    let userProgress = null;
    if (req.header('Authorization')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        userProgress = await Progress.findOne({
          user: decoded.userId,
          course: course._id,
          type: 'course'
        });
      } catch (err) {
        // Token invalid or expired, continue without progress
      }
    }

    res.json({
      course,
      userProgress
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ 
      message: 'Error fetching course',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Create new course (Teacher/Admin only)
router.post('/', [auth, teacherOrAdmin], [
  body('title').notEmpty().trim().escape(),
  body('description').notEmpty().trim(),
  body('subject').isIn(['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'environmental_science']),
  body('grade').isInt({ min: 6, max: 12 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ 
      message: 'Error creating course',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Update course enrollment count
    course.analytics.enrollmentCount += 1;
    await course.save();

    // Create initial progress record
    const progress = new Progress({
      user: userId,
      course: courseId,
      type: 'course'
    });
    await progress.save();

    res.json({
      message: 'Successfully enrolled in course',
      progress
    });

  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({ 
      message: 'Error enrolling in course',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get user's enrolled courses
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'instructor',
          select: 'profile.firstName profile.lastName'
        }
      });

    // Get progress for each enrolled course
    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          course: course._id,
          type: 'course'
        });

        return {
          ...course.toObject(),
          progress: progress ? progress.progress : { overallProgress: 0 }
        };
      })
    );

    res.json({ courses: coursesWithProgress });

  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ 
      message: 'Error fetching enrolled courses',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get course subjects and grades for filters
router.get('/meta/filters', async (req, res) => {
  try {
    const subjects = await Course.distinct('subject', { isPublished: true });
    const grades = await Course.distinct('grade', { isPublished: true });
    const difficulties = await Course.distinct('difficulty', { isPublished: true });
    const languages = await Course.distinct('multilingual.supportedLanguages', { isPublished: true });

    res.json({
      subjects,
      grades: grades.sort(),
      difficulties,
      languages
    });

  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ 
      message: 'Error fetching filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
