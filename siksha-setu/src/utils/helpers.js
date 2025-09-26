// Date formatting utilities
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatDateTime = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

// Time duration utilities
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
};

export const formatSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Number formatting utilities
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

// String utilities
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Color utilities for subjects
export const getSubjectColor = (subject) => {
  const colors = {
    mathematics: 'bg-blue-500',
    physics: 'bg-purple-500',
    chemistry: 'bg-green-500',
    biology: 'bg-emerald-500',
    computer_science: 'bg-indigo-500',
    environmental_science: 'bg-teal-500',
    general: 'bg-gray-500'
  };
  return colors[subject] || colors.general;
};

export const getSubjectTextColor = (subject) => {
  const colors = {
    mathematics: 'text-blue-500',
    physics: 'text-purple-500',
    chemistry: 'text-green-500',
    biology: 'text-emerald-500',
    computer_science: 'text-indigo-500',
    environmental_science: 'text-teal-500',
    general: 'text-gray-500'
  };
  return colors[subject] || colors.general;
};

// Difficulty level utilities
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500',
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-red-500'
  };
  return colors[difficulty] || 'text-gray-500';
};

export const getDifficultyBadgeColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
};

// Grade level utilities
export const getGradeDisplay = (grade) => {
  const suffixes = {
    1: 'st', 2: 'nd', 3: 'rd'
  };
  const suffix = suffixes[grade % 10] || 'th';
  return `${grade}${suffix} Grade`;
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// URL utilities
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

// Achievement and gamification utilities
export const getLevelInfo = (points) => {
  const level = Math.floor(points / 1000) + 1;
  const currentLevelPoints = (level - 1) * 1000;
  const nextLevelPoints = level * 1000;
  const progressToNext = points - currentLevelPoints;
  const pointsNeeded = nextLevelPoints - points;
  
  return {
    level,
    progressToNext,
    pointsNeeded,
    progressPercentage: (progressToNext / 1000) * 100
  };
};

export const getBadgeIcon = (badgeName) => {
  const icons = {
    'First Steps': '🎯',
    'Perfect Score': '⭐',
    'Week Warrior': '🔥',
    'Problem Solver': '🧩',
    'Speed Learner': '⚡',
    'Consistent Learner': '📚',
    'Subject Master': '🏆',
    'Helper': '🤝',
    'Explorer': '🔍'
  };
  return icons[badgeName] || '🏅';
};

// Device and responsive utilities
export const isMobile = () => {
  return window.innerWidth < 768;
};

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Offline/Online utilities
export const isOnline = () => {
  return navigator.onLine;
};

export const addOnlineListener = (callback) => {
  window.addEventListener('online', callback);
};

export const addOfflineListener = (callback) => {
  window.addEventListener('offline', callback);
};

export const removeOnlineListener = (callback) => {
  window.removeEventListener('online', callback);
};

export const removeOfflineListener = (callback) => {
  window.removeEventListener('offline', callback);
};

export default {
  formatDate,
  formatDateTime,
  formatTimeAgo,
  formatDuration,
  formatSeconds,
  formatNumber,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  validateEmail,
  validatePassword,
  getSubjectColor,
  getSubjectTextColor,
  getDifficultyColor,
  getDifficultyBadgeColor,
  getGradeDisplay,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  groupBy,
  sortBy,
  buildQueryString,
  getLevelInfo,
  getBadgeIcon,
  isMobile,
  isTablet,
  isDesktop,
  debounce,
  isOnline,
  addOnlineListener,
  addOfflineListener,
  removeOnlineListener,
  removeOfflineListener
};
