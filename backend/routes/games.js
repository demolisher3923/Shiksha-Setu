const express = require('express');
const Game = require('../models/Game');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { auth, teacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all games with filters
router.get('/', async (req, res) => {
  try {
    const { 
      subject, 
      grade, 
      difficulty, 
      type, 
      language,
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isActive: true };
    
    if (subject) filter.subject = subject;
    if (grade) filter.grade = parseInt(grade);
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;
    if (language) {
      filter['accessibility.supportedLanguages'] = language;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const games = await Game.find(filter)
      .populate('createdBy', 'profile.firstName profile.lastName')
      .select('-gameConfig.questions') // Exclude questions for list view
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalGames = await Game.countDocuments(filter);

    res.json({
      games,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalGames / parseInt(limit)),
        totalGames,
        hasNext: skip + games.length < totalGames,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ 
      message: 'Error fetching games',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get single game with full details
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('createdBy', 'profile.firstName profile.lastName');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Increment play count
    game.analytics.playCount += 1;
    await game.save();

    res.json({ game });

  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ 
      message: 'Error fetching game',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Create new game (Teacher/Admin only)
router.post('/', [auth, teacherOrAdmin], async (req, res) => {
  try {
    const gameData = {
      ...req.body,
      createdBy: req.user._id
    };

    const game = new Game(gameData);
    await game.save();

    res.status(201).json({
      message: 'Game created successfully',
      game
    });

  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ 
      message: 'Error creating game',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Play game and submit score
router.post('/:id/play', auth, async (req, res) => {
  try {
    const { score, maxScore, timeSpent, answers, difficulty } = req.body;
    const gameId = req.params.id;
    const userId = req.user._id;

    // Validate game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Calculate points based on performance
    const basePoints = game.rewards.pointsPerCorrect || 10;
    let earnedPoints = Math.floor((score / maxScore) * basePoints * game.gameConfig.questions.length);
    
    // Apply difficulty multiplier
    const difficultyMultipliers = { easy: 1, medium: 1.2, hard: 1.5 };
    earnedPoints = Math.floor(earnedPoints * (difficultyMultipliers[difficulty] || 1));

    // Apply time bonus (faster completion = more points)
    const timeBonus = Math.max(0, Math.floor((300 - timeSpent) / 10)); // Bonus for completing under 5 minutes
    earnedPoints += timeBonus;

    // Find or create progress record
    let progress = await Progress.findOne({
      user: userId,
      game: gameId,
      type: 'game'
    });

    if (!progress) {
      progress = new Progress({
        user: userId,
        game: gameId,
        type: 'game'
      });
    }

    // Add score to progress
    progress.scores.push({
      activity: 'game_completion',
      score,
      maxScore,
      timeSpent,
      completedAt: new Date()
    });

    // Update best score and analytics
    const bestScore = progress.scores.reduce((max, s) => 
      Math.max(max, (s.score / s.maxScore) * 100), 0
    );

    progress.performanceMetrics.accuracyRate = bestScore;
    await progress.save();

    // Update user points and level
    const user = await User.findById(userId);
    user.gamification.totalPoints += earnedPoints;
    
    // Check for level up
    const leveledUp = user.updateLevel();
    
    // Update daily streak
    const today = new Date().toDateString();
    const lastActivity = new Date(user.gamification.streak.lastActivity).toDateString();
    
    if (today !== lastActivity) {
      if (new Date().getTime() - new Date(user.gamification.streak.lastActivity).getTime() <= 86400000) {
        // Within 24 hours - continue streak
        user.gamification.streak.current += 1;
      } else {
        // Streak broken - reset
        user.gamification.streak.current = 1;
      }
      user.gamification.streak.lastActivity = new Date();
      
      if (user.gamification.streak.current > user.gamification.streak.longest) {
        user.gamification.streak.longest = user.gamification.streak.current;
      }
    }

    await user.save();

    // Update game analytics
    const allScores = await Progress.find({ game: gameId }).select('scores');
    const totalScores = allScores.reduce((sum, p) => sum + p.scores.length, 0);
    const avgScore = allScores.reduce((sum, p) => {
      const userAvg = p.scores.reduce((s, score) => s + (score.score / score.maxScore * 100), 0) / p.scores.length;
      return sum + userAvg;
    }, 0) / allScores.length;

    game.analytics.averageScore = avgScore || 0;
    await game.save();

    // Check for achievements
    const achievements = await checkGameAchievements(user, game, progress);

    res.json({
      message: 'Game completed successfully',
      earnedPoints,
      leveledUp,
      currentLevel: user.gamification.level,
      totalPoints: user.gamification.totalPoints,
      streak: user.gamification.streak.current,
      achievements,
      bestScore: Math.round(bestScore)
    });

  } catch (error) {
    console.error('Play game error:', error);
    res.status(500).json({ 
      message: 'Error submitting game score',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get user's game statistics
router.get('/stats/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const gameProgress = await Progress.find({
      user: userId,
      type: 'game'
    }).populate('game', 'title type subject difficulty');

    const stats = {
      totalGamesPlayed: gameProgress.length,
      totalScore: gameProgress.reduce((sum, p) => 
        sum + p.scores.reduce((s, score) => s + score.score, 0), 0
      ),
      averageAccuracy: gameProgress.reduce((sum, p) => 
        sum + (p.performanceMetrics.accuracyRate || 0), 0
      ) / (gameProgress.length || 1),
      favoriteSubjects: {},
      recentGames: gameProgress
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
      achievements: req.user.gamification.achievements,
      totalTimeSpent: gameProgress.reduce((sum, p) => 
        sum + p.scores.reduce((s, score) => s + (score.timeSpent || 0), 0), 0
      )
    };

    // Calculate favorite subjects
    gameProgress.forEach(p => {
      if (p.game && p.game.subject) {
        stats.favoriteSubjects[p.game.subject] = 
          (stats.favoriteSubjects[p.game.subject] || 0) + 1;
      }
    });

    res.json({ stats });

  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching game statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Helper function to check for achievements
async function checkGameAchievements(user, game, progress) {
  const achievements = [];
  
  // First game achievement
  if (progress.scores.length === 1) {
    achievements.push({
      title: 'First Steps',
      description: 'Completed your first game!',
      points: 50,
      category: 'milestone'
    });
  }

  // Perfect score achievement
  const latestScore = progress.scores[progress.scores.length - 1];
  if (latestScore.score === latestScore.maxScore) {
    achievements.push({
      title: 'Perfect Score',
      description: `Got a perfect score in ${game.title}!`,
      points: 100,
      category: 'performance'
    });
  }

  // Streak achievements
  if (user.gamification.streak.current === 7) {
    achievements.push({
      title: 'Week Warrior',
      description: 'Maintained a 7-day streak!',
      points: 200,
      category: 'consistency'
    });
  }

  // Save achievements to user
  if (achievements.length > 0) {
    user.gamification.achievements.push(...achievements);
    user.gamification.totalPoints += achievements.reduce((sum, a) => sum + a.points, 0);
    await user.save();
  }

  return achievements;
}

module.exports = router;
