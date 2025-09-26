const express = require('express');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Game = require('../models/Game');
const { auth, teacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get student analytics (for teachers and admins)
router.get('/students', [auth, teacherOrAdmin], async (req, res) => {
  try {
    const { 
      grade, 
      subject, 
      timeframe = 'month',
      startDate,
      endDate
    } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const now = new Date();
      switch (timeframe) {
        case 'week':
          dateFilter.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
          break;
        case 'month':
          dateFilter.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'quarter':
          dateFilter.createdAt = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    // Student engagement metrics
    const studentFilter = { 
      role: 'student', 
      isActive: true,
      ...(grade && { 'profile.grade': parseInt(grade) })
    };

    const totalStudents = await User.countDocuments(studentFilter);
    const activeStudents = await User.countDocuments({
      ...studentFilter,
      lastLogin: dateFilter.createdAt || { $exists: true }
    });

    // Learning progress analytics
    const progressPipeline = [
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
        $match: {
          'userInfo.role': 'student',
          'userInfo.isActive': true,
          ...(grade && { 'userInfo.profile.grade': parseInt(grade) }),
          ...dateFilter
        }
      }
    ];

    if (subject) {
      progressPipeline.push({
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      });
      progressPipeline.push({
        $match: {
          'courseInfo.subject': subject
        }
      });
    }

    const progressStats = await Progress.aggregate([
      ...progressPipeline,
      {
        $group: {
          _id: null,
          averageProgress: { $avg: '$progress.overallProgress' },
          totalTimeSpent: { $sum: '$progress.timeSpent' },
          completedCourses: {
            $sum: {
              $cond: [{ $gte: ['$progress.overallProgress', 100] }, 1, 0]
            }
          },
          averageAccuracy: { $avg: '$performanceMetrics.accuracyRate' },
          totalActivities: { $sum: { $size: '$scores' } }
        }
      }
    ]);

    // Subject-wise performance
    const subjectPerformance = await Progress.aggregate([
      ...progressPipeline,
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $group: {
          _id: '$courseInfo.subject',
          averageProgress: { $avg: '$progress.overallProgress' },
          studentCount: { $addToSet: '$user' },
          averageAccuracy: { $avg: '$performanceMetrics.accuracyRate' },
          totalTimeSpent: { $sum: '$progress.timeSpent' }
        }
      },
      {
        $project: {
          subject: '$_id',
          averageProgress: { $round: ['$averageProgress', 1] },
          studentCount: { $size: '$studentCount' },
          averageAccuracy: { $round: ['$averageAccuracy', 1] },
          totalTimeSpent: 1
        }
      }
    ]);

    // Learning streaks analysis
    const streakAnalysis = await User.aggregate([
      {
        $match: studentFilter
      },
      {
        $group: {
          _id: null,
          averageStreak: { $avg: '$gamification.streak.current' },
          maxStreak: { $max: '$gamification.streak.longest' },
          studentsWithStreak: {
            $sum: {
              $cond: [{ $gt: ['$gamification.streak.current', 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Grade-wise distribution
    const gradeDistribution = await User.aggregate([
      {
        $match: { role: 'student', isActive: true }
      },
      {
        $group: {
          _id: '$profile.grade',
          count: { $sum: 1 },
          averagePoints: { $avg: '$gamification.totalPoints' },
          averageLevel: { $avg: '$gamification.level' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      overview: {
        totalStudents,
        activeStudents,
        engagementRate: Math.round((activeStudents / totalStudents) * 100),
        ...progressStats[0]
      },
      subjectPerformance,
      streakAnalysis: streakAnalysis[0] || {},
      gradeDistribution,
      timeframe,
      filters: { grade, subject }
    });

  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching student analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get individual student detailed analytics
router.get('/student/:studentId', [auth, teacherOrAdmin], async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId)
      .select('-password')
      .populate('enrolledCourses', 'title subject grade');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all progress records for this student
    const progressRecords = await Progress.find({ user: studentId })
      .populate('course', 'title subject grade')
      .populate('game', 'title type subject grade')
      .sort({ updatedAt: -1 });

    // Calculate comprehensive statistics
    const stats = {
      profile: student.profile,
      gamification: student.gamification,
      totalCourses: student.enrolledCourses.length,
      completedCourses: progressRecords.filter(p => p.progress.overallProgress >= 100).length,
      totalGamesPlayed: progressRecords.filter(p => p.type === 'game').length,
      totalTimeSpent: progressRecords.reduce((sum, p) => sum + p.progress.timeSpent, 0),
      averageAccuracy: progressRecords.reduce((sum, p) => sum + (p.performanceMetrics.accuracyRate || 0), 0) / progressRecords.length,
      strongSubjects: [],
      weakSubjects: [],
      recentActivity: [],
      learningPattern: {}
    };

    // Analyze subject performance
    const subjectStats = {};
    progressRecords.forEach(progress => {
      const subject = progress.course?.subject || progress.game?.subject;
      if (subject) {
        if (!subjectStats[subject]) {
          subjectStats[subject] = { scores: [], timeSpent: 0, activities: 0 };
        }
        subjectStats[subject].scores.push(...progress.scores.map(s => (s.score / s.maxScore) * 100));
        subjectStats[subject].timeSpent += progress.progress.timeSpent;
        subjectStats[subject].activities += progress.scores.length;
      }
    });

    // Identify strong and weak subjects
    Object.entries(subjectStats).forEach(([subject, data]) => {
      const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      if (avgScore >= 80) {
        stats.strongSubjects.push({ subject, averageScore: Math.round(avgScore), activities: data.activities });
      } else if (avgScore < 60) {
        stats.weakSubjects.push({ subject, averageScore: Math.round(avgScore), activities: data.activities });
      }
    });

    // Recent activity (last 10 activities)
    stats.recentActivity = progressRecords
      .flatMap(p => p.scores.map(score => ({
        date: score.completedAt,
        activity: p.course?.title || p.game?.title,
        type: p.type,
        score: Math.round((score.score / score.maxScore) * 100),
        timeSpent: score.timeSpent,
        subject: p.course?.subject || p.game?.subject
      })))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Learning pattern analysis
    const activityByHour = {};
    const activityByDay = {};
    
    stats.recentActivity.forEach(activity => {
      const date = new Date(activity.date);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      activityByHour[hour] = (activityByHour[hour] || 0) + 1;
      activityByDay[day] = (activityByDay[day] || 0) + 1;
    });

    const mostActiveHour = Object.entries(activityByHour).reduce((max, [hour, count]) => 
      count > max.count ? { hour: parseInt(hour), count } : max, { hour: 0, count: 0 });
    
    const mostActiveDay = Object.entries(activityByDay).reduce((max, [day, count]) => 
      count > max.count ? { day, count } : max, { day: 'Monday', count: 0 });

    stats.learningPattern = {
      mostActiveHour: mostActiveHour.hour,
      mostActiveDay: mostActiveDay.day,
      averageSessionDuration: stats.totalTimeSpent / (progressRecords.length || 1),
      activityDistribution: { byHour: activityByHour, byDay: activityByDay }
    };

    res.json({ student: stats });

  } catch (error) {
    console.error('Get individual student analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching individual student analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get content analytics (courses and games)
router.get('/content', [auth, teacherOrAdmin], async (req, res) => {
  try {
    const { type = 'all', subject, grade } = req.query;

    // Course analytics
    let courseAnalytics = [];
    if (type === 'all' || type === 'courses') {
      const courseFilter = { isPublished: true };
      if (subject) courseFilter.subject = subject;
      if (grade) courseFilter.grade = parseInt(grade);

      courseAnalytics = await Course.aggregate([
        { $match: courseFilter },
        {
          $lookup: {
            from: 'progresses',
            localField: '_id',
            foreignField: 'course',
            as: 'progressData'
          }
        },
        {
          $project: {
            title: 1,
            subject: 1,
            grade: 1,
            enrollmentCount: '$analytics.enrollmentCount',
            completionRate: {
              $cond: {
                if: { $gt: ['$analytics.enrollmentCount', 0] },
                then: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $size: {
                            $filter: {
                              input: '$progressData',
                              cond: { $gte: ['$$this.progress.overallProgress', 100] }
                            }
                          }
                        },
                        '$analytics.enrollmentCount'
                      ]
                    },
                    100
                  ]
                },
                else: 0
              }
            },
            averageProgress: { $avg: '$progressData.progress.overallProgress' },
            totalTimeSpent: { $sum: '$progressData.progress.timeSpent' }
          }
        },
        { $sort: { enrollmentCount: -1 } }
      ]);
    }

    // Game analytics
    let gameAnalytics = [];
    if (type === 'all' || type === 'games') {
      const gameFilter = { isActive: true };
      if (subject) gameFilter.subject = subject;
      if (grade) gameFilter.grade = parseInt(grade);

      gameAnalytics = await Game.aggregate([
        { $match: gameFilter },
        {
          $lookup: {
            from: 'progresses',
            localField: '_id',
            foreignField: 'game',
            as: 'progressData'
          }
        },
        {
          $project: {
            title: 1,
            type: 1,
            subject: 1,
            grade: 1,
            playCount: '$analytics.playCount',
            averageScore: '$analytics.averageScore',
            completionRate: {
              $cond: {
                if: { $gt: ['$analytics.playCount', 0] },
                then: {
                  $multiply: [
                    {
                      $divide: [
                        { $size: '$progressData' },
                        '$analytics.playCount'
                      ]
                    },
                    100
                  ]
                },
                else: 0
              }
            },
            uniquePlayers: { $size: '$progressData' },
            totalScores: {
              $sum: {
                $map: {
                  input: '$progressData',
                  as: 'progress',
                  in: { $size: '$$progress.scores' }
                }
              }
            }
          }
        },
        { $sort: { playCount: -1 } }
      ]);
    }

    // Popular content by engagement
    const popularContent = [
      ...courseAnalytics.slice(0, 5).map(c => ({ ...c, contentType: 'course' })),
      ...gameAnalytics.slice(0, 5).map(g => ({ ...g, contentType: 'game' }))
    ].sort((a, b) => {
      const engagementA = a.contentType === 'course' ? a.enrollmentCount : a.playCount;
      const engagementB = b.contentType === 'course' ? b.enrollmentCount : b.playCount;
      return engagementB - engagementA;
    });

    res.json({
      courses: courseAnalytics,
      games: gameAnalytics,
      popularContent: popularContent.slice(0, 10),
      summary: {
        totalCourses: courseAnalytics.length,
        totalGames: gameAnalytics.length,
        averageCourseCompletion: courseAnalytics.reduce((sum, c) => sum + c.completionRate, 0) / (courseAnalytics.length || 1),
        averageGameScore: gameAnalytics.reduce((sum, g) => sum + g.averageScore, 0) / (gameAnalytics.length || 1)
      }
    });

  } catch (error) {
    console.error('Get content analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching content analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get platform usage analytics
router.get('/platform', [auth, teacherOrAdmin], async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;

    // Build date filter
    const now = new Date();
    let dateFilter = {};
    
    switch (timeframe) {
      case 'week':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'quarter':
        dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
        break;
    }

    // User growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: dateFilter,
          role: 'student'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily active users
    const dailyActiveUsers = await User.aggregate([
      {
        $match: {
          lastLogin: dateFilter,
          role: 'student'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$lastLogin"
            }
          },
          activeUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Overall statistics
    const totalUsers = await User.countDocuments({ role: 'student', isActive: true });
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalGames = await Game.countDocuments({ isActive: true });
    const totalProgress = await Progress.countDocuments();

    // Engagement metrics
    const engagementMetrics = await Progress.aggregate([
      {
        $match: {
          updatedAt: dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: { $size: '$scores' } },
          totalTimeSpent: { $sum: '$progress.timeSpent' },
          averageSessionTime: { $avg: '$progress.timeSpent' },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          totalSessions: 1,
          totalTimeSpent: 1,
          averageSessionTime: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalGames,
        totalProgress,
        ...engagementMetrics[0]
      },
      userGrowth,
      dailyActiveUsers,
      timeframe
    });

  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching platform analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
