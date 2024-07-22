import { createSlice, configureStore, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface GameState {
  mode: 'matching' | 'result';
  countdown: number;
  scores: { [index: string]: number };
  result: {
    left: number;
    right: number;
  };
}

const initialState: GameState = {
  mode: 'matching',
  countdown: 60,
  result: {
    left: -1,
    right: -1
  },
  scores: {}
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    roundStart() {
      return initialState;
    },
    countdown(state) {
      state.countdown -= 1;
    },
    checkMatch(state, action: PayloadAction<{ left?: number; right?: number }>) {
      if (typeof action.payload.left === 'number') {
        state.result.left = action.payload.left;
      }

      if (typeof action.payload.right === 'number') {
        state.result.right = action.payload.right;
      }

      if (state.result.left === state.result.right && state.result.left >= 0) {
        const currentScore = state.scores[state.result.left];
        if (typeof currentScore === 'number') {
          state.scores[state.result.left] = currentScore + 1;
        } else {
          state.scores[state.result.left] = 1;
        }
      }
    },
    resetMatch(state) {
      state.result.left = state.result.right = -1;
    }
  }
});

export const store = configureStore({
  reducer: gameSlice.reducer
});

export const roundStart = createAsyncThunk('game/roundStart', async (arg, { signal, dispatch, getState }) => {
  while (!signal.aborted) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(gameSlice.actions.countdown());

    const state = getState() as GameState;
    if (state.countdown === 0) {
      break;
    }
  }
});

export const selectSymbol = createAsyncThunk(
  'game/selectSymbol',
  async (arg: { left?: number; right?: number }, { signal, dispatch, getState }) => {
    dispatch(gameSlice.actions.checkMatch(arg));

    await new Promise(resolve => setTimeout(resolve, 2000));
    const { result } = getState() as GameState;
    if (result.left !== -1 && result.right !== -1) {
      dispatch(gameSlice.actions.resetMatch());
    }
  }
);
