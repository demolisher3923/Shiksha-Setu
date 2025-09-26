import React from 'react';
import { User, Mail, School, GraduationCap, Calendar, Trophy, Star, Target } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    grade: '10',
    school: 'Delhi Public School',
    joinDate: 'January 2024',
    stats: {
      totalPoints: 1250,
      coursesCompleted: 3,
      currentStreak: 7,
      achievements: 5
    }
  };

  const achievements = [
    { id: 1, title: 'Math Master', description: 'Completed 10 math problems', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, title: 'Streak Champion', description: '7 days learning streak', icon: Star, color: 'text-orange-500' },
    { id: 3, title: 'Science Explorer', description: 'Finished Physics basics', icon: Target, color: 'text-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 text-lg capitalize">{user.role}</p>
                <p className="text-indigo-100">Grade {user.grade} • {user.school}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-medium text-gray-900">Grade {user.grade}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <School className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">School</p>
                    <p className="font-medium text-gray-900">{user.school}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{user.stats.totalPoints}</div>
                  <div className="text-sm text-yellow-700">Total Points</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.stats.coursesCompleted}</div>
                  <div className="text-sm text-green-700">Courses Completed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{user.stats.currentStreak}</div>
                  <div className="text-sm text-orange-700">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.achievements}</div>
                  <div className="text-sm text-purple-700">Achievements</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-3 rounded-full bg-white ${achievement.color}`}>
                      <achievement.icon className="h-6 w-6" />
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
