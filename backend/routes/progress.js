const express = require('express');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user progress overview
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all progress records for the user
    const progressRecords = await Progress.find({ user: userId })
      .populate('course', 'title subject grade thumbnail')
      .populate('game', 'title type subject difficulty')
      .sort({ updatedAt: -1 });

    // Calculate overall statistics
    const stats = {
      totalCourses: progressRecords.filter(p => p.type === 'course').length,
      completedCourses: progressRecords.filter(p => p.type === 'course' && p.progress.overallProgress >= 100).length,
      totalGames: progressRecords.filter(p => p.type === 'game').length,
      totalTimeSpent: progressRecords.reduce((sum, p) => sum + p.progress.timeSpent, 0),
      averageAccuracy: progressRecords.reduce((sum, p) => sum + (p.performanceMetrics.accuracyRate || 0), 0) / (progressRecords.length || 1),
      currentStreak: req.user.gamification.streak.current,
      longestStreak: req.user.gamification.streak.longest,
      totalPoints: req.user.gamification.totalPoints,
      currentLevel: req.user.gamification.level,
      badges: req.user.gamification.badges.length,
      achievements: req.user.gamification.achievements.length
    };

    // Subject-wise progress
    const subjectProgress = {};
    progressRecords.forEach(progress => {
      const subject = progress.course?.subject || progress.game?.subject;
      if (subject) {
        if (!subjectProgress[subject]) {
          subjectProgress[subject] = {
            subject,
            totalActivities: 0,
            completedActivities: 0,
            averageScore: 0,
            timeSpent: 0,
            scores: []
          };
        }
        
        subjectProgress[subject].totalActivities += 1;
        if (progress.progress.overallProgress >= 100) {
          subjectProgress[subject].completedActivities += 1;
        }
        subjectProgress[subject].timeSpent += progress.progress.timeSpent;
        
        const subjectScores = progress.scores.map(s => (s.score / s.maxScore) * 100);
        subjectProgress[subject].scores.push(...subjectScores);
      }
    });

    // Calculate average scores for subjects
    Object.values(subjectProgress).forEach(subject => {
      subject.averageScore = subject.scores.length > 0 
        ? subject.scores.reduce((sum, score) => sum + score, 0) / subject.scores.length 
        : 0;
      subject.progressPercentage = (subject.completedActivities / subject.totalActivities) * 100;
      delete subject.scores; // Remove scores array from response
    });

    // Recent activity
    const recentActivity = progressRecords
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

    // Weekly progress chart data
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayString = date.toISOString().split('T')[0];
      
      const dayActivities = recentActivity.filter(activity => 
        new Date(activity.date).toISOString().split('T')[0] === dayString
      );

      weeklyProgress.push({
        date: dayString,
        activities: dayActivities.length,
        timeSpent: dayActivities.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
        averageScore: dayActivities.length > 0 
          ? dayActivities.reduce((sum, a) => sum + a.score, 0) / dayActivities.length 
          : 0
      });
    }

    res.json({
      stats,
      subjectProgress: Object.values(subjectProgress),
      recentActivity,
      weeklyProgress,
      recommendations: await generateRecommendations(userId, subjectProgress)
    });

  } catch (error) {
    console.error('Get progress overview error:', error);
    res.status(500).json({ 
      message: 'Error fetching progress overview',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get detailed progress for a specific course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({
      user: userId,
      course: courseId,
      type: 'course'
    }).populate('course');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for this course' });
    }

    // Calculate chapter-wise progress
    const course = progress.course;
    const chapterProgress = course.chapters.map((chapter, chapterIndex) => {
      const completedLessons = chapter.lessons.filter((lesson, lessonIndex) => 
        progress.progress.completedLessons.includes(`${chapterIndex}-${lessonIndex}`)
      ).length;

      return {
        chapterIndex,
        title: chapter.title,
        totalLessons: chapter.lessons.length,
        completedLessons,
        progress: (completedLessons / chapter.lessons.length) * 100,
        isCurrentChapter: chapterIndex === progress.progress.currentChapter
      };
    });

    // Quiz scores for this course
    const quizScores = progress.scores.filter(score => 
      score.activity && score.activity.includes('quiz')
    ).map(score => ({
      activity: score.activity,
      score: score.score,
      maxScore: score.maxScore,
      percentage: Math.round((score.score / score.maxScore) * 100),
      completedAt: score.completedAt,
      attempts: score.attempts
    }));

    res.json({
      course: {
        _id: course._id,
        title: course.title,
        subject: course.subject,
        grade: course.grade
      },
      progress: {
        ...progress.progress,
        chapterProgress,
        estimatedTimeToComplete: calculateEstimatedTime(course, progress)
      },
      performance: progress.performanceMetrics,
      quizScores,
      achievements: progress.achievements,
      weakAreas: progress.weakAreas,
      strengths: progress.strengths
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ 
      message: 'Error fetching course progress',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Update lesson progress
router.put('/lesson', auth, async (req, res) => {
  try {
    const { courseId, chapterIndex, lessonIndex, timeSpent, quizScore } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({
      user: userId,
      course: courseId,
      type: 'course'
    });

    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        type: 'course'
      });
    }

    // Mark lesson as completed
    const lessonKey = `${chapterIndex}-${lessonIndex}`;
    if (!progress.progress.completedLessons.includes(lessonKey)) {
      progress.progress.completedLessons.push(lessonKey);
    }

    // Update time spent
    progress.progress.timeSpent += timeSpent || 0;
    progress.progress.lastAccessedAt = new Date();

    // Update current position if progressing forward
    if (chapterIndex >= progress.progress.currentChapter) {
      progress.progress.currentChapter = chapterIndex;
      if (chapterIndex === progress.progress.currentChapter && lessonIndex >= progress.progress.currentLesson) {
        progress.progress.currentLesson = lessonIndex + 1;
      }
    }

    // Add quiz score if provided
    if (quizScore) {
      progress.scores.push({
        activity: `Chapter ${chapterIndex + 1} - Lesson ${lessonIndex + 1} Quiz`,
        score: quizScore.score,
        maxScore: quizScore.maxScore,
        timeSpent: quizScore.timeSpent || 0,
        completedAt: new Date()
      });
    }

    // Calculate overall progress
    const course = await Course.findById(courseId);
    const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
    progress.progress.overallProgress = (progress.progress.completedLessons.length / totalLessons) * 100;

    // Update user streak
    const user = await User.findById(userId);
    const today = new Date().toDateString();
    const lastActivity = new Date(user.gamification.streak.lastActivity).toDateString();
    
    if (today !== lastActivity) {
      if (new Date().getTime() - new Date(user.gamification.streak.lastActivity).getTime() <= 86400000) {
        user.gamification.streak.current += 1;
      } else {
        user.gamification.streak.current = 1;
      }
      user.gamification.streak.lastActivity = new Date();
      
      if (user.gamification.streak.current > user.gamification.streak.longest) {
        user.gamification.streak.longest = user.gamification.streak.current;
      }
      
      await user.save();
    }

    await progress.save();

    res.json({
      message: 'Progress updated successfully',
      progress: {
        overallProgress: progress.progress.overallProgress,
        currentChapter: progress.progress.currentChapter,
        currentLesson: progress.progress.currentLesson,
        timeSpent: progress.progress.timeSpent
      },
      streak: user.gamification.streak.current
    });

  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({ 
      message: 'Error updating progress',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get learning analytics for user
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user._id;
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

    const progressRecords = await Progress.find({
      user: userId,
      updatedAt: dateFilter
    }).populate('course', 'title subject').populate('game', 'title subject');

    // Learning time analysis
    const dailyActivity = {};
    const subjectTime = {};
    const hourlyActivity = Array(24).fill(0);

    progressRecords.forEach(progress => {
      // Daily activity
      const dateStr = progress.updatedAt.toISOString().split('T')[0];
      if (!dailyActivity[dateStr]) {
        dailyActivity[dateStr] = { timeSpent: 0, activities: 0 };
      }
      dailyActivity[dateStr].timeSpent += progress.progress.timeSpent;
      dailyActivity[dateStr].activities += progress.scores.length;

      // Subject time distribution
      const subject = progress.course?.subject || progress.game?.subject;
      if (subject) {
        subjectTime[subject] = (subjectTime[subject] || 0) + progress.progress.timeSpent;
      }

      // Hourly activity pattern
      progress.scores.forEach(score => {
        const hour = new Date(score.completedAt).getHours();
        hourlyActivity[hour]++;
      });
    });

    // Performance trends
    const performanceTrend = Object.entries(dailyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        timeSpent: data.timeSpent,
        activities: data.activities
      }));

    // Study pattern insights
    const mostActiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const totalTime = Object.values(subjectTime).reduce((sum, time) => sum + time, 0);
    const favoriteSubject = Object.entries(subjectTime).reduce((max, [subject, time]) => 
      time > max.time ? { subject, time } : max, { subject: null, time: 0 });

    res.json({
      summary: {
        totalTimeSpent: totalTime,
        averageDailyTime: totalTime / Math.max(Object.keys(dailyActivity).length, 1),
        totalActivities: progressRecords.reduce((sum, p) => sum + p.scores.length, 0),
        mostActiveHour,
        favoriteSubject: favoriteSubject.subject
      },
      performanceTrend,
      subjectDistribution: Object.entries(subjectTime).map(([subject, time]) => ({
        subject,
        time,
        percentage: Math.round((time / totalTime) * 100) || 0
      })),
      hourlyPattern: hourlyActivity,
      insights: generateLearningInsights(dailyActivity, subjectTime, hourlyActivity)
    });

  } catch (error) {
    console.error('Get learning analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching learning analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Helper functions
function calculateEstimatedTime(course, progress) {
  const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const completedLessons = progress.progress.completedLessons.length;
  const remainingLessons = totalLessons - completedLessons;
  
  // Estimate 15 minutes per lesson on average
  return remainingLessons * 15;
}

async function generateRecommendations(userId, subjectProgress) {
  const recommendations = [];
  
  // Find weak subjects
  const weakSubjects = Object.values(subjectProgress)
    .filter(subject => subject.averageScore < 70)
    .sort((a, b) => a.averageScore - b.averageScore);

  if (weakSubjects.length > 0) {
    recommendations.push({
      type: 'improvement',
      title: `Focus on ${weakSubjects[0].subject}`,
      description: `Your average score in ${weakSubjects[0].subject} is ${Math.round(weakSubjects[0].averageScore)}%. Consider reviewing the basics.`,
      priority: 'high'
    });
  }

  // Streak maintenance
  const user = await User.findById(userId);
  if (user.gamification.streak.current >= 3) {
    recommendations.push({
      type: 'streak',
      title: 'Maintain your streak!',
      description: `You're on a ${user.gamification.streak.current}-day streak. Keep it going!`,
      priority: 'medium'
    });
  }

  return recommendations;
}

function generateLearningInsights(dailyActivity, subjectTime, hourlyActivity) {
  const insights = [];
  
  // Most productive time
  const mostActiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
  if (mostActiveHour >= 6 && mostActiveHour <= 11) {
    insights.push("You're most productive in the morning hours.");
  } else if (mostActiveHour >= 12 && mostActiveHour <= 17) {
    insights.push("Your peak learning time is in the afternoon.");
  } else if (mostActiveHour >= 18 && mostActiveHour <= 22) {
    insights.push("You learn best in the evening.");
  }

  // Consistency check
  const activeDays = Object.keys(dailyActivity).length;
  if (activeDays >= 5) {
    insights.push("Great consistency! You're maintaining regular study habits.");
  } else if (activeDays >= 3) {
    insights.push("Good progress! Try to study more consistently for better results.");
  }

  return insights;
}

module.exports = router;
