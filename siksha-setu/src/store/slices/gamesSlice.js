import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/games', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchGameById = createAsyncThunk(
  'games/fetchGameById',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const playGame = createAsyncThunk(
  'games/playGame',
  async ({ gameId, gameData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/games/${gameId}/play`, gameData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchUserGameStats = createAsyncThunk(
  'games/fetchUserGameStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/games/stats/user');
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  games: [],
  currentGame: null,
  gameResult: null,
  userStats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    averageAccuracy: 0,
    favoriteSubjects: {},
    recentGames: [],
    achievements: [],
    totalTimeSpent: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalGames: 0,
    hasNext: false,
    hasPrev: false
  },
  isLoading: false,
  isPlaying: false,
  error: null,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
    clearGameResult: (state) => {
      state.gameResult = null;
    },
    setGameResult: (state, action) => {
      state.gameResult = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload.games;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Game by ID
      .addCase(fetchGameById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload.game;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Play Game
      .addCase(playGame.pending, (state) => {
        state.isPlaying = true;
        state.error = null;
      })
      .addCase(playGame.fulfilled, (state, action) => {
        state.isPlaying = false;
        state.gameResult = action.payload;
      })
      .addCase(playGame.rejected, (state, action) => {
        state.isPlaying = false;
        state.error = action.payload;
      })
      // Fetch User Game Stats
      .addCase(fetchUserGameStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      });
  },
});

export const { clearError, clearCurrentGame, clearGameResult, setGameResult } = gamesSlice.actions;
export default gamesSlice.reducer;
