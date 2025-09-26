import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Star, 
  TrendingUp, 
  Clock, 
  Users, 
  Award,
  Play,
  CheckCircle,
  Calendar,
  Zap
} from 'lucide-react';
import { fetchUserProgress } from '../../store/slices/progressSlice';
import { fetchCourses } from '../../store/slices/coursesSlice';
import { fetchLeaderboard } from '../../store/slices/leaderboardSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { progress, isLoading: progressLoading } = useSelector((state) => state.progress);
  const { courses, isLoading: coursesLoading } = useSelector((state) => state.courses);
  const { leaderboard, isLoading: leaderboardLoading } = useSelector((state) => state.leaderboard);

  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Fetch dashboard data
    if (user?._id) {
      dispatch(fetchUserProgress(user._id));
      dispatch(fetchCourses());
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, user]);

  const getGreeting = () => {
    const greetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening'
    };
    return greetings[timeOfDay] || 'Hello';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to unlock new knowledge today?",
      "Every step forward is progress!",
      "Your learning journey continues!",
      "Today is perfect for discovering something new!",
      "Keep up the amazing work!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Mock data for demonstration (replace with real data from Redux store)
  const mockStats = {
    totalPoints: progress?.totalPoints || 1250,
    coursesCompleted: progress?.completedCourses?.length || 3,
    currentStreak: progress?.streak || 7,
    rank: progress?.rank || 15,
    weeklyGoal: 5,
    weeklyProgress: 3,
    todayMinutes: 45,
    targetMinutes: 60
  };

  const recentAchievements = [
    { id: 1, title: 'Math Master', description: 'Completed 10 math problems', icon: Award, color: 'text-yellow-500' },
    { id: 2, title: 'Streak Champion', description: '7 days learning streak', icon: Zap, color: 'text-orange-500' },
    { id: 3, title: 'Science Explorer', description: 'Finished Physics basics', icon: Star, color: 'text-blue-500' }
  ];

  const recentCourses = courses?.slice(0, 3) || [
    { 
      _id: 1, 
      title: 'Advanced Mathematics', 
      subject: 'Mathematics',
      progress: 75,
      nextLesson: 'Quadratic Equations',
      estimatedTime: '25 min'
    },
    { 
      _id: 2, 
      title: 'Physics Fundamentals', 
      subject: 'Physics',
      progress: 60,
      nextLesson: 'Laws of Motion',
      estimatedTime: '30 min'
    },
    { 
      _id: 3, 
      title: 'Chemistry Basics', 
      subject: 'Chemistry',
      progress: 40,
      nextLesson: 'Atomic Structure',
      estimatedTime: '20 min'
    }
  ];

  const topLearners = leaderboard?.slice(0, 5) || [
    { rank: 1, name: 'Priya Sharma', points: 2150, avatar: 'PS' },
    { rank: 2, name: 'Rahul Kumar', points: 1980, avatar: 'RK' },
    { rank: 3, name: 'Ananya Singh', points: 1850, avatar: 'AS' },
    { rank: 4, name: 'Vikram Patel', points: 1720, avatar: 'VP' },
    { rank: 5, name: 'Kavya Reddy', points: 1650, avatar: 'KR' }
  ];

  if (progressLoading || coursesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-indigo-100 text-lg">
                  {getMotivationalMessage()}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockStats.totalPoints}</div>
                  <div className="text-indigo-200 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">#{mockStats.rank}</div>
                  <div className="text-indigo-200 text-sm">Your Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Points */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalPoints}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Courses Completed */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Courses Completed</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.coursesCompleted}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.currentStreak} days</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Study</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.todayMinutes}min</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Weekly Goal</h2>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress: {mockStats.weeklyProgress}/{mockStats.weeklyGoal} courses</span>
                  <span>{Math.round((mockStats.weeklyProgress / mockStats.weeklyGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(mockStats.weeklyProgress / mockStats.weeklyGoal) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Great job! You're {mockStats.weeklyGoal - mockStats.weeklyProgress} courses away from your weekly goal.
              </p>
            </div>

            {/* Continue Learning */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Continue</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-4">
                        <span>{course.progress}% complete</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
                <Award className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-white ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {topLearners.map((learner, index) => (
                  <div key={learner.rank} className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {learner.rank}
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                      {learner.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{learner.name}</p>
                      <p className="text-sm text-gray-600">{learner.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                View Full Leaderboard
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Start Learning</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Practice Quiz</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>View Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
