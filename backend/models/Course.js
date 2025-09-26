const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'environmental_science']
  },
  grade: {
    type: Number,
    required: true,
    min: 6,
    max: 12
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chapters: [{
    title: { type: String, required: true },
    description: String,
    order: { type: Number, required: true },
    lessons: [{
      title: { type: String, required: true },
      content: { type: String, required: true },
      type: {
        type: String,
        enum: ['video', 'text', 'interactive', 'quiz', 'game'],
        default: 'text'
      },
      duration: Number, // in minutes
      resources: [{
        name: String,
        url: String,
        type: String
      }],
      quiz: {
        questions: [{
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
          points: { type: Number, default: 10 }
        }],
        passingScore: { type: Number, default: 70 }
      },
      isLocked: { type: Boolean, default: false },
      prerequisites: [String]
    }]
  }],
  gamification: {
    totalPoints: { type: Number, default: 0 },
    badges: [{
      name: String,
      description: String,
      criteria: String,
      icon: String,
      points: Number
    }],
    achievements: [{
      title: String,
      description: String,
      criteria: String,
      points: Number
    }]
  },
  multilingual: {
    supportedLanguages: [{
      type: String,
      enum: ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi']
    }],
    translations: {
      type: Map,
      of: {
        title: String,
        description: String,
        content: Map
      }
    }
  },
  offline: {
    isOfflineCompatible: { type: Boolean, default: true },
    downloadSize: Number, // in MB
    lastSyncVersion: { type: String, default: '1.0.0' }
  },
  analytics: {
    enrollmentCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for search optimization
courseSchema.index({ title: 'text', description: 'text', subject: 1, grade: 1 });

module.exports = mongoose.model('Course', courseSchema);
