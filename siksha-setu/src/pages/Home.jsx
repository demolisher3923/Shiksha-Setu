import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Gamepad2, Users, BarChart3, Globe, Smartphone, Star, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8 text-purple-600" />,
      title: 'Interactive Games',
      description: 'Engaging educational games that make learning STEM subjects fun and memorable.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: 'Comprehensive Courses',
      description: 'Well-structured courses covering grades 6-12 with multilingual content support.'
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      title: 'Offline Access',
      description: 'Download content for offline learning, perfect for areas with limited connectivity.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: 'Progress Analytics',
      description: 'Track learning progress with detailed analytics for students and teachers.'
    },
    {
      icon: <Users className="w-8 h-8 text-red-600" />,
      title: 'Collaborative Learning',
      description: 'Connect with peers, participate in group challenges and learn together.'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
      title: 'Mobile Friendly',
      description: 'Optimized for low-cost devices and works seamlessly across all platforms.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Learning' },
    { number: '500+', label: 'Interactive Games' },
    { number: '100+', label: 'Courses Available' },
    { number: '15%', label: 'Engagement Increase' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Grade 9 Student',
      content: 'The games make learning physics so much fun! I understand concepts better now.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Mathematics Teacher',
      content: 'Amazing platform for rural education. My students are more engaged than ever.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Grade 11 Student',
      content: 'Offline feature is a game-changer. I can study even without internet connection.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Shiksha Setu
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Empowering rural students with gamified digital learning. Interactive STEM education 
              with multilingual content and offline access designed for low-cost devices.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Start Learning
              </Link>
              <Link
                to="/login"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Shiksha Setu?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Designed specifically for rural education with cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white/30 backdrop-blur-sm px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to Transform Education?
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Join thousands of students and teachers already using Shiksha Setu to make learning more engaging and effective.
          </p>
          <div className="mt-10">
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">Shiksha Setu</h3>
              <p className="text-gray-300 mb-4">
                Bridging the educational gap in rural areas through innovative technology and gamified learning experiences.
              </p>
              <div className="flex space-x-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">15% Engagement Increase Guaranteed</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
                <li><Link to="/games" className="hover:text-white">Games</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shiksha Setu. All rights reserved. Empowering rural education through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
