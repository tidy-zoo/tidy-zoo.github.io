import { createSlice, configureStore, PayloadAction, createAsyncThunk, Unsubscribe } from '@reduxjs/toolkit';

interface GameState {
  scene: 'welcome' | 'matching' | 'scores';
  textureProgress: number;
  countdowning: boolean;
  countdown: number;
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

export const newRound = createAsyncThunk(
  'game/newRound',
  async (_, { signal, dispatch, getState }) => {
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
  },
  {
    condition: (_, { getState }) => {
      const { scene } = getState() as GameState;
      return scene === 'scores' || scene === 'welcome';
    }
  }
);

export const selectSymbol = createAsyncThunk(
  'game/selectSymbol',
  async (arg: { left?: number; right?: number }, { dispatch, getState }) => {
    dispatch(gameSlice.actions.checkMatch(arg));

    const { result } = getState() as GameState;
    if (result.left !== -1 && result.right !== -1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
);

export const initialState: GameState = {
  scene: 'welcome',
  textureProgress: 0,
  countdowning: false,
  countdown: import.meta.env.VITE_APP_COUNTING_DOWN,
  result: {
    left: -1,
    right: -1
  },
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
        state.roundScore += 1;
        if (state.historyScores.hasOwnProperty(state.result.left)) {
          state.historyScores[state.result.left] += 1;
        } else {
          state.historyScores[state.result.left] = 1;
        }
      }
    },
    resetMatch(state) {
      state.result.left = state.result.right = -1;
    },
    summarize(state) {
      state.countdowning = false;
      state.historyRoundScores = [...state.historyRoundScores, state.roundScore].sort((n1, n2) => n2 - n1).slice(0, 3);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(newRound.pending, state => {
        return {
          ...initialState,
          textureProgress: state.textureProgress,
          historyRoundScores: state.historyRoundScores,
          historyScores: state.historyScores,
          countdowning: true,
          scene: 'matching'
        };
      })
      .addCase(selectSymbol.fulfilled, state => {
        if (state.result.left >= 0 && state.result.right >= 0) {
          state.result.left = state.result.right = -1;
        }
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
