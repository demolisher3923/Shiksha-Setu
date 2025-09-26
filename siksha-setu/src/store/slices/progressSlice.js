import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchProgressOverview = createAsyncThunk(
  'progress/fetchProgressOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/progress/overview');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchCourseProgress = createAsyncThunk(
  'progress/fetchCourseProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/course/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  'progress/updateLessonProgress',
  async (progressData, { rejectWithValue }) => {
    try {
      const response = await api.put('/progress/lesson', progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchLearningAnalytics = createAsyncThunk(
  'progress/fetchLearningAnalytics',
  async (timeframe = 'month', { rejectWithValue }) => {
    try {
      const response = await api.get('/progress/analytics', { 
        params: { timeframe } 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  overview: {
    stats: {
      totalCourses: 0,
      completedCourses: 0,
      totalGames: 0,
      totalTimeSpent: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      currentLevel: 1,
      badges: 0,
      achievements: 0
    },
    subjectProgress: [],
    recentActivity: [],
    weeklyProgress: [],
    recommendations: []
  },
  courseProgress: null,
  analytics: {
    summary: {
      totalTimeSpent: 0,
      averageDailyTime: 0,
      totalActivities: 0,
      mostActiveHour: 0,
      favoriteSubject: null
    },
    performanceTrend: [],
    subjectDistribution: [],
    hourlyPattern: [],
    insights: []
  },
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCourseProgress: (state) => {
      state.courseProgress = null;
    },
    updateStreakLocally: (state, action) => {
      state.overview.stats.currentStreak = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Progress Overview
      .addCase(fetchProgressOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgressOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchProgressOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Course Progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseProgress = action.payload;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Lesson Progress
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        // Update course progress if it exists
        if (state.courseProgress) {
          state.courseProgress.progress = {
            ...state.courseProgress.progress,
            ...action.payload.progress
          };
        }
        // Update streak in overview
        if (action.payload.streak) {
          state.overview.stats.currentStreak = action.payload.streak;
        }
      })
      // Fetch Learning Analytics
      .addCase(fetchLearningAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearError, clearCourseProgress, updateStreakLocally } = progressSlice.actions;
export default progressSlice.reducer;
