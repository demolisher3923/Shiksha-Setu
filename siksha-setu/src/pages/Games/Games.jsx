import React from 'react';
import { Play, Trophy, Star, Users, Clock } from 'lucide-react';

const Games = () => {
  const games = [
    {
      id: 1,
      title: 'Math Quest',
      description: 'Solve mathematical puzzles and challenges',
      category: 'Mathematics',
      difficulty: 'Easy',
      players: 1234,
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/300x200/4F46E5/white?text=Math+Quest',
      estimatedTime: '15 min'
    },
    {
      id: 2,
      title: 'Physics Lab',
      description: 'Conduct virtual physics experiments',
      category: 'Physics',
      difficulty: 'Medium',
      players: 892,
      rating: 4.6,
      thumbnail: 'https://via.placeholder.com/300x200/059669/white?text=Physics+Lab',
      estimatedTime: '25 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Educational Games</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <img src={game.thumbnail} alt={game.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{game.players}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{game.estimatedTime}</span>
                  </div>
                </div>
                
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Play Game</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
