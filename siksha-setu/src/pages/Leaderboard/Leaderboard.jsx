import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

const Leaderboard = () => {
  const topLearners = [
    { rank: 1, name: 'Priya Sharma', points: 2150, avatar: 'PS', school: 'Delhi Public School' },
    { rank: 2, name: 'Rahul Kumar', points: 1980, avatar: 'RK', school: 'St. Mary\'s School' },
    { rank: 3, name: 'Ananya Singh', points: 1850, avatar: 'AS', school: 'Modern School' },
    { rank: 4, name: 'Vikram Patel', points: 1720, avatar: 'VP', school: 'Ryan International' },
    { rank: 5, name: 'Kavya Reddy', points: 1650, avatar: 'KR', school: 'Kendriya Vidyalaya' },
    { rank: 6, name: 'Arjun Mehta', points: 1580, avatar: 'AM', school: 'DAV Public School' },
    { rank: 7, name: 'Sneha Gupta', points: 1520, avatar: 'SG', school: 'Bal Bharati School' },
    { rank: 8, name: 'Karan Joshi', points: 1480, avatar: 'KJ', school: 'Sardar Patel School' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <Trophy className="h-6 w-6 text-gray-400" />;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank among top learners!</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {topLearners.slice(0, 3).map((learner, index) => (
            <div key={learner.rank} className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
              <div className={`relative ${index === 0 ? 'top-0' : 'top-4'}`}>
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${getRankStyle(learner.rank)}`}>
                  {learner.avatar}
                </div>
                <div className="flex justify-center mb-2">
                  {getRankIcon(learner.rank)}
                </div>
                <h3 className="font-semibold text-gray-900">{learner.name}</h3>
                <p className="text-sm text-gray-600">{learner.school}</p>
                <p className="font-bold text-indigo-600">{learner.points} pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Learners</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {topLearners.map((learner) => (
              <div key={learner.rank} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                      learner.rank <= 3 ? getRankStyle(learner.rank) : 'bg-gray-200 text-gray-700'
                    }`}>
                      {learner.rank}
                    </div>
                    
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                      {learner.avatar}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{learner.name}</h3>
                      <p className="text-sm text-gray-600">{learner.school}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-indigo-600 text-lg">{learner.points}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User's Rank */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                15
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-semibold">
                YU
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900">Your Rank</h3>
                <p className="text-sm text-indigo-700">Keep learning to climb higher!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-indigo-600 text-lg">1250</div>
              <div className="text-sm text-indigo-600">points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
