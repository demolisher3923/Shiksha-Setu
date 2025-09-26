import React from 'react';
import { Play } from 'lucide-react';

const GameDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Math Quest</h1>
          <p className="text-gray-600 mb-6">Solve mathematical puzzles and challenges in this exciting game!</p>
          
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <Play className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Game will load here</h2>
            <p className="text-gray-600">Game integration coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
