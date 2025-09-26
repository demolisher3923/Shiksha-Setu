const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  type: {
    type: String,
    enum: ['course', 'game', 'quiz', 'lesson'],
    required: true
  },
  progress: {
    completedLessons: [String],
    currentChapter: { type: Number, default: 0 },
    currentLesson: { type: Number, default: 0 },
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastAccessedAt: { type: Date, default: Date.now }
  },
  scores: [{
    activity: String,
    score: Number,
    maxScore: Number,
    attempts: { type: Number, default: 1 },
    completedAt: { type: Date, default: Date.now },
    timeSpent: Number // in seconds
  }],
  achievements: [{
    achievementId: String,
    unlockedAt: { type: Date, default: Date.now },
    points: Number
  }],
  streaks: {
    dailyStreak: { type: Number, default: 0 },
    weeklyStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now }
  },
  weakAreas: [{
    topic: String,
    subject: String,
    accuracy: Number,
    recommendedResources: [String]
  }],
  strengths: [{
    topic: String,
    subject: String,
    accuracy: Number,
    masteryLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    }
  }],
  studyPattern: {
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night']
    },
    averageSessionDuration: Number, // in minutes
    studyFrequency: Number, // sessions per week
    mostActiveDay: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  },
  performanceMetrics: {
    accuracyRate: { type: Number, default: 0 },
    averageTimePerQuestion: Number,
    improvementRate: Number,
    consistencyScore: Number
  },
  certificates: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: String,
    grade: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ user: 1, course: 1 });
progressSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Progress', progressSchema);
