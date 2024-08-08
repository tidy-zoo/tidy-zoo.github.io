import { createSlice, configureStore, PayloadAction, createAsyncThunk, Unsubscribe } from '@reduxjs/toolkit';

interface GameState {
  scene: 'welcome' | 'matching' | 'scores';
  textureProgress: number;
  countdowning: boolean;
  countdown: number;
  scores: { [index: string]: number };
  roundScore: 0;
  historyScores: { [index: string]: number };
  historyRoundScores: number[];
  result: {
    left: number;
    right: number;
  };
}

const readLocalStorage = (key: string): any => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : val;
};

const writeLocalStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const newRound = createAsyncThunk('game/newRound', async (_, { signal, dispatch, getState }) => {
  while (!signal.aborted) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(gameSlice.actions.countdown());

    const state = getState() as GameState;
    if (state.countdown === 0) {
      break;
    }
  }
  dispatch(gameSlice.actions.summarize());

  const { historyRoundScores, historyScores } = getState() as GameState;
  writeLocalStorage('historyRoundScores', historyRoundScores);
  writeLocalStorage('historyScores', historyScores);
});

export const selectSymbol = createAsyncThunk(
  'game/selectSymbol',
  async (arg: { left?: number; right?: number }, { dispatch, getState }) => {
    dispatch(gameSlice.actions.checkMatch(arg));

    await new Promise(resolve => setTimeout(resolve, 2000));
    const { result } = getState() as GameState;
    if (result.left !== -1 && result.right !== -1) {
      dispatch(gameSlice.actions.resetMatch());
    }
  }
);

export const initialState: GameState = {
  scene: 'welcome',
  textureProgress: 0,
  countdowning: false,
  countdown: 45,
  result: {
    left: -1,
    right: -1
  },
  scores: {},
  roundScore: 0,
  historyScores: readLocalStorage('historyScores') ?? {},
  historyRoundScores: readLocalStorage('historyRoundScores') ?? []
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateTextureProgress(state, action) {
      state.textureProgress = action.payload;
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

        const currentHistoryScore = state.historyScores[state.result.left];
        if (typeof currentHistoryScore === 'number') {
          state.historyScores[state.result.left] = currentHistoryScore + 1;
        } else {
          state.historyScores[state.result.left] = 1;
        }

        state.roundScore += 1;
      }
    },
    resetMatch(state) {
      state.result.left = state.result.right = -1;
    },
    summarize(state) {
      state.countdowning = false;
      const historyRoundScores = state.historyRoundScores.slice();
      historyRoundScores.push(state.roundScore);
      historyRoundScores.sort((n1, n2) => n2 - n1);
      state.historyRoundScores = historyRoundScores.slice(0, 3);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(newRound.pending, () => {
        return {
          ...initialState,
          countdowning: true,
          scene: 'matching'
        };
      })
      .addCase(newRound.fulfilled, state => {
        state.scene = 'scores';
      });
  }
});

export const store = configureStore({
  reducer: gameSlice.reducer
});

export const watchStore = (selector: (state: GameState) => any, callback: (state: GameState) => void): Unsubscribe => {
  let prevValue: any;

  const handleStateChange = () => {
    const state = store.getState();
    const value = selector(state);
    if (value !== prevValue) {
      callback(state);
      prevValue = value;
    }
  };

  handleStateChange();
  return store.subscribe(handleStateChange);
};

export const { updateTextureProgress } = gameSlice.actions;
