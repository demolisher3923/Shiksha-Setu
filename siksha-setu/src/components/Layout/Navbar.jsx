import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const unreadNotifications = notifications?.filter(n => !n.read)?.length || 0;

  return (
    <nav className="glass-effect border-b border-white/10 fixed top-0 right-0 left-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white hidden sm:block tracking-tight">
                Shiksha Setu
              </span>
            </Link>
          </div>

          {/* Right side - Navigation and User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <Bell className="h-6 w-6 group-hover:text-cyan-400 transition-colors duration-300" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="font-bold text-white text-lg">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications?.slice(0, 5).map((notification, index) => (
                      <div
                        key={index}
                        className={`px-6 py-4 hover:bg-white/5 cursor-pointer transition-all duration-300 ${
                          !notification.read ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                        }`}
                      >
                        <p className="text-sm font-semibold text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    )) || (
                      <div className="px-6 py-8 text-center text-gray-400">
                        No notifications yet
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t border-white/10">
                    <Link
                      to="/notifications"
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block font-semibold text-white">
                  {user?.name}
                </span>
                <ChevronDown className="h-5 w-5 group-hover:text-cyan-400 transition-colors duration-300" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                  <div className="px-6 py-4 border-b border-white/10">
                    <p className="font-bold text-white text-lg">{user?.name}</p>
                    <p className="text-sm text-gray-300">{user?.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User className="h-5 w-5 group-hover:text-cyan-400 transition-colors duration-300" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings className="h-5 w-5 group-hover:text-cyan-400 transition-colors duration-300" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  
                  <div className="border-t border-white/10 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left group"
                  >
                    <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/10">
          <div className="px-6 py-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/games"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Games
            </Link>
            <Link
              to="/leaderboard"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
