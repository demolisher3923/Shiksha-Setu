import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  User, 
  BarChart3,
  Target,
  Settings,
  HelpCircle,
  Bookmark
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
      current: location.pathname.startsWith('/courses')
    },
    {
      name: 'Games',
      href: '/games',
      icon: Gamepad2,
      current: location.pathname.startsWith('/games')
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      current: location.pathname === '/leaderboard'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile'
    }
  ];

  // Add teacher-specific navigation items
  if (user?.role === 'teacher') {
    navigationItems.splice(4, 0, {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname === '/analytics'
    });
  }

  const secondaryItems = [
    {
      name: 'My Goals',
      href: '/goals',
      icon: Target,
      current: location.pathname === '/goals'
    },
    {
      name: 'Bookmarks',
      href: '/bookmarks',
      icon: Bookmark,
      current: location.pathname === '/bookmarks'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      current: location.pathname === '/help'
    }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 pt-16">
      <div className="flex flex-col h-full">
        {/* User Info Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 truncate">
                {user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {user?.role || 'Student'}
              </p>
              {user?.grade && (
                <p className="text-xs text-indigo-600">
                  Grade {user.grade}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    item.current
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Secondary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              More
            </p>
            {secondaryItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
                    item.current
                      ? 'text-gray-700'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Level Up!</p>
                <p className="text-xs text-gray-600">Complete 2 more courses</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
