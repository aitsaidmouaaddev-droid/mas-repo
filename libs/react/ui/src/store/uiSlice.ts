import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const THEME_KEY = 'mas-theme-mode';

function readPersistedTheme(): 'light' | 'dark' {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    // localStorage unavailable (SSR / private browsing)
  }
  return 'dark';
}

export interface UiState {
  /** Current colour scheme. */
  theme: 'light' | 'dark';
  /** True when viewport width ≤ 768 px. */
  isMobile: boolean;
}

const initialState: UiState = {
  theme: typeof window !== 'undefined' ? readPersistedTheme() : 'dark',
  isMobile:
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 768px)').matches
      : false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, state.theme);
      } catch { /* ignore */ }
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      try {
        localStorage.setItem(THEME_KEY, state.theme);
      } catch { /* ignore */ }
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setIsMobile } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
