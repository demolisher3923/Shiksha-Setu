const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // For now, return mock notifications
    // In a real implementation, you would have a Notification model
    const mockNotifications = [
      {
        _id: '1',
        title: 'Course Completion',
        message: 'Congratulations! You completed the Mathematics course.',
        type: 'achievement',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        metadata: {
          courseId: 'course123',
          points: 500
        }
      },
      {
        _id: '2',
        title: 'New Badge Earned',
        message: 'You earned the "Problem Solver" badge!',
        type: 'badge',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        metadata: {
          badgeName: 'Problem Solver',
          points: 100
        }
      },
      {
        _id: '3',
        title: 'Streak Milestone',
        message: 'Amazing! You\'ve maintained a 7-day learning streak!',
        type: 'streak',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        metadata: {
          streakDays: 7,
          points: 200
        }
      },
      {
        _id: '4',
        title: 'New Game Available',
        message: 'Check out the new Physics simulation game!',
        type: 'content',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        metadata: {
          gameId: 'game456',
          subject: 'Physics'
        }
      },
      {
        _id: '5',
        title: 'Weekly Report',
        message: 'Your learning summary for this week is ready.',
        type: 'report',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
        metadata: {
          totalTime: 420, // minutes
          coursesStudied: 3,
          gamesPlayed: 8
        }
      }
    ];

    // Filter notifications based on user preference
    let notifications = unreadOnly === 'true' 
      ? mockNotifications.filter(n => !n.read)
      : mockNotifications;

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotifications = notifications.slice(skip, skip + parseInt(limit));

    res.json({
      notifications: paginatedNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(notifications.length / parseInt(limit)),
        totalNotifications: notifications.length,
        hasNext: skip + paginatedNotifications.length < notifications.length,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    // In a real implementation, you would update the notification in the database
    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      message: 'Error marking notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    // In a real implementation, you would update all user's notifications
    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      message: 'Error marking all notifications as read',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Delete notification
router.delete('/:notificationId', auth, async (req, res) => {
  try {
    // In a real implementation, you would delete the notification from the database
    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ 
      message: 'Error deleting notification',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
