import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchGlobalLeaderboard = createAsyncThunk(
  'leaderboard/fetchGlobalLeaderboard',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboard/global', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSubjectLeaderboard = createAsyncThunk(
  'leaderboard/fetchSubjectLeaderboard',
  async ({ subject, ...params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leaderboard/subject/${subject}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchUserRanking = createAsyncThunk(
  'leaderboard/fetchUserRanking',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboard/user/ranking', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchWeeklyChampions = createAsyncThunk(
  'leaderboard/fetchWeeklyChampions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboard/champions/weekly');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  globalLeaderboard: [],
  subjectLeaderboard: [],
  userRanking: {
    currentUser: {
      rank: 0,
      percentile: 0,
      user: null
    },
    nearby: {
      above: [],
      below: []
    },
    totalUsers: 0
  },
  weeklyChampions: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  },
  currentTimeframe: 'all_time',
  currentSubject: null,
  isLoading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTimeframe: (state, action) => {
      state.currentTimeframe = action.payload;
    },
    setCurrentSubject: (state, action) => {
      state.currentSubject = action.payload;
    },
    clearSubjectLeaderboard: (state) => {
      state.subjectLeaderboard = [];
      state.currentSubject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Global Leaderboard
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.globalLeaderboard = action.payload.leaderboard;
        state.pagination = action.payload.pagination;
        state.currentTimeframe = action.payload.timeframe;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Subject Leaderboard
      .addCase(fetchSubjectLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubjectLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjectLeaderboard = action.payload.leaderboard;
        state.currentSubject = action.payload.subject;
      })
      .addCase(fetchSubjectLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Ranking
      .addCase(fetchUserRanking.fulfilled, (state, action) => {
        state.userRanking = action.payload;
      })
      // Fetch Weekly Champions
      .addCase(fetchWeeklyChampions.fulfilled, (state, action) => {
        state.weeklyChampions = action.payload.champions;
      });
  },
});

export const { 
  clearError, 
  setTimeframe, 
  setCurrentSubject, 
  clearSubjectLeaderboard 
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
