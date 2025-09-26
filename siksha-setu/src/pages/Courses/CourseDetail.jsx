import React from 'react';
import { BookOpen, Play, Star, Clock, Users, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
  // Mock course data
  const course = {
    _id: '1',
    title: 'Advanced Mathematics',
    description: 'Master advanced mathematical concepts including algebra, geometry, and calculus',
    subject: 'Mathematics',
    difficulty: 'Advanced',
    grade: ['10', '11', '12'],
    duration: 45,
    studentsEnrolled: 234,
    rating: 4.8,
    instructor: 'Dr. Priya Sharma',
    thumbnail: 'https://via.placeholder.com/800x400/4F46E5/white?text=Math',
    progress: 75,
    isEnrolled: true,
    completedLessons: 15,
    totalLessons: 20,
    language: 'English',
    tags: ['Algebra', 'Geometry', 'Problem Solving'],
    lessons: [
      { id: 1, title: 'Introduction to Algebra', completed: true, duration: '15 min' },
      { id: 2, title: 'Linear Equations', completed: true, duration: '20 min' },
      { id: 3, title: 'Quadratic Equations', completed: false, duration: '25 min', current: true },
      { id: 4, title: 'Polynomials', completed: false, duration: '18 min' },
      { id: 5, title: 'Factoring', completed: false, duration: '22 min' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="relative">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                <Play className="h-5 w-5" />
                <span>Continue Learning</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{course.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.studentsEnrolled} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{course.progress}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Course Progress</span>
                <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Lessons</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      lesson.current
                        ? 'border-indigo-300 bg-indigo-50'
                        : lesson.completed
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-500 text-white'
                            : lesson.current
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-semibold">{lesson.id}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          lesson.completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : lesson.current
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lesson.completed ? 'Review' : lesson.current ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-indigo-700">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor}</p>
                  <p className="text-sm text-gray-600">Mathematics Professor</p>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium text-gray-900">{course.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium text-gray-900">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject</span>
                  <span className="font-medium text-gray-900">{course.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grade Level</span>
                  <span className="font-medium text-gray-900">{course.grade.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Take Quiz
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Download Resources
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Ask Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
