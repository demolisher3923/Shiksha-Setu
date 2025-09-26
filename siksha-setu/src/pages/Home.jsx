import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Gamepad2, Users, BarChart3, Globe, Smartphone, Star, CheckCircle, Sparkles, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: 'Interactive Games',
      description: 'Engaging educational games that make learning STEM subjects fun and memorable.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Comprehensive Courses',
      description: 'Well-structured courses covering grades 6-12 with multilingual content support.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Offline Access',
      description: 'Download content for offline learning, perfect for areas with limited connectivity.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Progress Analytics',
      description: 'Track learning progress with detailed analytics for students and teachers.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborative Learning',
      description: 'Connect with peers, participate in group challenges and learn together.'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="glass-effect border-b border-white/10 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Shiksha Setu</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 font-medium">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-all duration-300 font-medium">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 font-medium">Contact</a>
              <Link 
                to="/login" 
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-semibold"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg hover-lift"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold text-sm">Transform Learning Experience</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8">
              <span className="gradient-text block">Shiksha Setu</span>
              <span className="text-gray-300 text-3xl md:text-5xl font-light mt-4 block">
                The Future of Education
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-300 max-w-4xl mx-auto">
              Revolutionary gamified learning platform empowering rural students with 
              <span className="text-cyan-400 font-semibold"> interactive STEM education</span>, 
              multilingual content, and offline access designed for the next generation.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover-lift transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Start Learning Free</span>
                  <Zap className="w-5 h-5" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group px-8 py-4 glass-effect text-white rounded-2xl font-semibold text-lg hover-lift transition-all duration-300 border border-white/20"
              >
                <span className="flex items-center space-x-2">
                  <span>Explore Platform</span>
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="glass-effect p-8 rounded-2xl border border-white/20 hover-lift transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold text-sm">Revolutionary Features</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="gradient-text">Shiksha Setu</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Designed specifically for rural education with cutting-edge technology 
              that transforms the learning experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group glass-effect rounded-2xl p-8 border border-white/20 hover-lift transition-all duration-500 hover:border-cyan-400/50">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                    {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">Student Success Stories</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 border border-white/20 hover-lift transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-bold text-white text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-cyan-400 font-medium">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="glass-effect rounded-3xl p-12 border border-white/20">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Join the Revolution</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                Ready to <span className="gradient-text">Transform</span> Education?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students and teachers already using Shiksha Setu to make 
                learning more engaging, effective, and accessible for everyone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <Link
                to="/register"
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover-lift transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <TrendingUp className="w-6 h-6" />
                </span>
              </Link>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Free forever • No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="glass-effect py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">Shiksha Setu</span>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Bridging the educational gap in rural areas through innovative technology 
                  and gamified learning experiences that inspire and engage.
                </p>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300 font-medium">15% Engagement Increase Guaranteed</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-6">Platform</h4>
                <ul className="space-y-3">
                  <li><Link to="/courses" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Courses</Link></li>
                  <li><Link to="/games" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Games</Link></li>
                  <li><Link to="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Leaderboard</Link></li>
                  <li><Link to="/analytics" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Analytics</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-6">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Documentation</a></li>
                  <li><a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Contact Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Community</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-gray-400">&copy; 2024 <span className="text-cyan-400 font-semibold">Shiksha Setu</span>. All rights reserved. Empowering rural education through technology.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
