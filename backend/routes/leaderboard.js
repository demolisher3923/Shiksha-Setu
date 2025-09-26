const express = require('express');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { 
      timeframe = 'all_time', 
      subject,
      grade,
      limit = 50,
      page = 1
    } = req.query;

    let dateFilter = {};
    
    // Apply time filter
    if (timeframe === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter.updatedAt = { $gte: weekAgo };
    } else if (timeframe === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter.updatedAt = { $gte: monthAgo };
    }

    // Build user filter
    const userFilter = { isActive: true, role: 'student' };
    if (grade) {
      userFilter['profile.grade'] = parseInt(grade);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const leaderboard = await User.find(userFilter)
      .select('username profile.firstName profile.lastName profile.avatar profile.grade profile.school gamification.totalPoints gamification.level gamification.streak')
      .sort({ 'gamification.totalPoints': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add rankings
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: skip + index + 1
    }));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(userFilter);

    res.json({
      leaderboard: rankedLeaderboard,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNext: skip + leaderboard.length < totalUsers,
        hasPrev: parseInt(page) > 1
      },
      timeframe
    });

  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({ 
      message: 'Error fetching leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get subject-specific leaderboard
router.get('/subject/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const { grade, limit = 20 } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          type: 'game',
          ...(grade && { 'user.profile.grade': parseInt(grade) })
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: 'game',
          foreignField: '_id',
          as: 'gameInfo'
        }
      },
      {
        $match: {
          'gameInfo.subject': subject
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $group: {
          _id: '$user',
          totalScore: { 
            $sum: { 
              $sum: '$scores.score' 
            } 
          },
          totalGames: { $sum: 1 },
          averageAccuracy: { $avg: '$performanceMetrics.accuracyRate' },
          userInfo: { $first: '$userInfo' }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ];

    const results = await Progress.aggregate(pipeline);

    const leaderboard = results.map((result, index) => ({
      rank: index + 1,
      user: {
        _id: result._id,
        username: result.userInfo.username,
        profile: {
          firstName: result.userInfo.profile.firstName,
          lastName: result.userInfo.profile.lastName,
          avatar: result.userInfo.profile.avatar,
          grade: result.userInfo.profile.grade,
          school: result.userInfo.profile.school
        },
        gamification: {
          level: result.userInfo.gamification.level
        }
      },
      stats: {
        totalScore: result.totalScore,
        totalGames: result.totalGames,
        averageAccuracy: Math.round(result.averageAccuracy || 0)
      }
    }));

    res.json({
      leaderboard,
      subject,
      totalEntries: results.length
    });

  } catch (error) {
    console.error('Get subject leaderboard error:', error);
    res.status(500).json({ 
      message: 'Error fetching subject leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get user's ranking and nearby users
router.get('/user/ranking', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { grade } = req.query;

    // Build user filter
    const userFilter = { 
      isActive: true, 
      role: 'student',
      ...(grade && { 'profile.grade': parseInt(grade) })
    };

    // Get user's current rank
    const userRank = await User.countDocuments({
      ...userFilter,
      'gamification.totalPoints': { 
        $gt: req.user.gamification.totalPoints 
      }
    }) + 1;

    // Get users above and below current user
    const usersAbove = await User.find({
      ...userFilter,
      'gamification.totalPoints': { 
        $gt: req.user.gamification.totalPoints 
      }
    })
    .select('username profile.firstName profile.lastName profile.avatar profile.grade gamification.totalPoints gamification.level')
    .sort({ 'gamification.totalPoints': 1 })
    .limit(3);

    const usersBelow = await User.find({
      ...userFilter,
      'gamification.totalPoints': { 
        $lt: req.user.gamification.totalPoints 
      }
    })
    .select('username profile.firstName profile.lastName profile.avatar profile.grade gamification.totalPoints gamification.level')
    .sort({ 'gamification.totalPoints': -1 })
    .limit(3);

    // Get total users for percentage calculation
    const totalUsers = await User.countDocuments(userFilter);
    const percentile = Math.round(((totalUsers - userRank + 1) / totalUsers) * 100);

    res.json({
      currentUser: {
        rank: userRank,
        percentile,
        user: {
          _id: req.user._id,
          username: req.user.username,
          profile: req.user.profile,
          gamification: req.user.gamification
        }
      },
      nearby: {
        above: usersAbove.reverse().map((user, index) => ({
          rank: userRank - usersAbove.length + index,
          user
        })),
        below: usersBelow.map((user, index) => ({
          rank: userRank + index + 1,
          user
        }))
      },
      totalUsers
    });

  } catch (error) {
    console.error('Get user ranking error:', error);
    res.status(500).json({ 
      message: 'Error fetching user ranking',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get weekly champions
router.get('/champions/weekly', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get users who gained the most points this week
    const weeklyProgress = await Progress.aggregate([
      {
        $match: {
          updatedAt: { $gte: startOfWeek },
          type: 'game'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $group: {
          _id: '$user',
          weeklyPoints: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$scores',
                      cond: { $gte: ['$$this.completedAt', startOfWeek] }
                    }
                  },
                  as: 'score',
                  in: '$$score.score'
                }
              }
            }
          },
          gamesPlayed: {
            $sum: {
              $size: {
                $filter: {
                  input: '$scores',
                  cond: { $gte: ['$$this.completedAt', startOfWeek] }
                }
              }
            }
          },
          userInfo: { $first: '$userInfo' }
        }
      },
      {
        $sort: { weeklyPoints: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const champions = weeklyProgress.map((champion, index) => ({
      rank: index + 1,
      user: {
        _id: champion._id,
        username: champion.userInfo.username,
        profile: {
          firstName: champion.userInfo.profile.firstName,
          lastName: champion.userInfo.profile.lastName,
          avatar: champion.userInfo.profile.avatar,
          grade: champion.userInfo.profile.grade
        },
        gamification: {
          level: champion.userInfo.gamification.level
        }
      },
      weeklyStats: {
        points: champion.weeklyPoints,
        gamesPlayed: champion.gamesPlayed
      }
    }));

    res.json({
      champions,
      weekPeriod: {
        start: startOfWeek,
        end: new Date()
      }
    });

  } catch (error) {
    console.error('Get weekly champions error:', error);
    res.status(500).json({ 
      message: 'Error fetching weekly champions',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
