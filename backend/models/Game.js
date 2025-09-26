const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['quiz', 'puzzle', 'simulation', 'memory', 'strategy', 'word_game', 'math_game', 'science_lab']
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'general']
  },
  grade: {
    type: Number,
    required: true,
    min: 6,
    max: 12
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  thumbnail: String,
  gameConfig: {
    timeLimit: Number, // in seconds
    maxAttempts: { type: Number, default: 3 },
    minScore: { type: Number, default: 60 },
    questions: [{
      id: String,
      question: String,
      type: {
        type: String,
        enum: ['multiple_choice', 'true_false', 'fill_blank', 'drag_drop', 'matching']
      },
      options: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      explanation: String,
      points: { type: Number, default: 10 },
      hints: [String],
      multimedia: {
        image: String,
        video: String,
        audio: String
      }
    }],
    levels: [{
      level: Number,
      name: String,
      description: String,
      pointsRequired: Number,
      unlockCriteria: String
    }],
    powerUps: [{
      name: String,
      description: String,
      effect: String,
      cost: Number,
      icon: String
    }]
  },
  rewards: {
    pointsPerCorrect: { type: Number, default: 10 },
    bonusMultiplier: { type: Number, default: 1.5 },
    badges: [{
      name: String,
      description: String,
      criteria: String,
      icon: String
    }],
    achievements: [{
      title: String,
      description: String,
      points: Number,
      unlockCondition: String
    }]
  },
  multiplayer: {
    isMultiplayer: { type: Boolean, default: false },
    maxPlayers: { type: Number, default: 1 },
    gameMode: {
      type: String,
      enum: ['cooperative', 'competitive', 'team_vs_team'],
      default: 'competitive'
    }
  },
  accessibility: {
    supportedLanguages: [{
      type: String,
      enum: ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi']
    }],
    audioSupport: { type: Boolean, default: false },
    visualAids: { type: Boolean, default: true },
    keyboardNavigation: { type: Boolean, default: true }
  },
  offline: {
    isOfflineCompatible: { type: Boolean, default: true },
    downloadSize: Number,
    cacheVersion: { type: String, default: '1.0.0' }
  },
  analytics: {
    playCount: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

gameSchema.index({ subject: 1, grade: 1, difficulty: 1 });

module.exports = mongoose.model('Game', gameSchema);
