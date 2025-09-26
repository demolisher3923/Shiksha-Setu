import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  Trophy,
  Zap
} from 'lucide-react';
import { fetchCourses } from '../../store/slices/coursesSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Mock data for demonstration
  const mockCourses = [
    {
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
      thumbnail: 'https://via.placeholder.com/300x200/4F46E5/white?text=Math',
      progress: 75,
      isEnrolled: true,
      completedLessons: 15,
      totalLessons: 20,
      language: 'English',
      tags: ['Algebra', 'Geometry', 'Problem Solving']
    },
    {
      _id: '2',
      title: 'Physics Fundamentals',
      description: 'Explore the fundamental principles of physics through interactive experiments',
      subject: 'Physics',
      difficulty: 'Intermediate',
      grade: ['9', '10', '11'],
      duration: 38,
      studentsEnrolled: 189,
      rating: 4.6,
      instructor: 'Prof. Rahul Kumar',
      thumbnail: 'https://via.placeholder.com/300x200/059669/white?text=Physics',
      progress: 60,
      isEnrolled: true,
      completedLessons: 12,
      totalLessons: 20,
      language: 'English',
      tags: ['Mechanics', 'Electricity', 'Waves']
    },
    {
      _id: '3',
      title: 'Chemistry Essentials',
      description: 'Learn the building blocks of matter and chemical reactions',
      subject: 'Chemistry',
      difficulty: 'Beginner',
      grade: ['8', '9', '10'],
      duration: 32,
      studentsEnrolled: 156,
      rating: 4.7,
      instructor: 'Dr. Ananya Singh',
      thumbnail: 'https://via.placeholder.com/300x200/DC2626/white?text=Chemistry',
      progress: 0,
      isEnrolled: false,
      completedLessons: 0,
      totalLessons: 18,
      language: 'English',
      tags: ['Atoms', 'Molecules', 'Reactions']
    },
    {
      _id: '4',
      title: 'Biology Basics',
      description: 'Discover the wonders of life sciences and living organisms',
      subject: 'Biology',
      difficulty: 'Beginner',
      grade: ['7', '8', '9'],
      duration: 28,
      studentsEnrolled: 201,
      rating: 4.5,
      instructor: 'Dr. Vikram Patel',
      thumbnail: 'https://via.placeholder.com/300x200/059669/white?text=Biology',
      progress: 0,
      isEnrolled: false,
      completedLessons: 0,
      totalLessons: 16,
      language: 'English',
      tags: ['Cells', 'Genetics', 'Ecology']
    },
    {
      _id: '5',
      title: 'Computer Science Fundamentals',
      description: 'Introduction to programming and computational thinking',
      subject: 'Computer Science',
      difficulty: 'Intermediate',
      grade: ['9', '10', '11', '12'],
      duration: 42,
      studentsEnrolled: 178,
      rating: 4.9,
      instructor: 'Prof. Kavya Reddy',
      thumbnail: 'https://via.placeholder.com/300x200/7C3AED/white?text=CS',
      progress: 25,
      isEnrolled: true,
      completedLessons: 5,
      totalLessons: 20,
      language: 'English',
      tags: ['Programming', 'Algorithms', 'Logic']
    },
    {
      _id: '6',
      title: 'Environmental Science',
      description: 'Understanding our environment and sustainability challenges',
      subject: 'Science',
      difficulty: 'Beginner',
      grade: ['6', '7', '8'],
      duration: 25,
      studentsEnrolled: 143,
      rating: 4.4,
      instructor: 'Dr. Arjun Mehta',
      thumbnail: 'https://via.placeholder.com/300x200/10B981/white?text=Environment',
      progress: 0,
      isEnrolled: false,
      completedLessons: 0,
      totalLessons: 14,
      language: 'English',
      tags: ['Ecology', 'Conservation', 'Climate']
    }
  ];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesGrade = selectedGrade === 'all' || course.grade.includes(selectedGrade);
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesGrade;
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Science'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const grades = ['6', '7', '8', '9', '10', '11', '12'];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Discover and learn from our comprehensive STEM courses</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Thumbnail */}
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-gray-700">
                    {course.subject}
                  </span>
                </div>
                {course.isEnrolled && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.studentsEnrolled}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                {/* Progress Bar (for enrolled courses) */}
                {course.isEnrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <Link
                  to={`/courses/${course._id}`}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    course.isEnrolled
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {course.isEnrolled ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Continue Learning</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4" />
                      <span>View Course</span>
                    </>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
