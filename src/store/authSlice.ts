import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import defaultAvatar from '../assets/layout/avatar.png';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  avatarUrl: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  accessToken: null,
  avatarUrl: defaultAvatar,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; avatarUrl: string }>,
    ) => {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.avatarUrl = action.payload.avatarUrl;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.avatarUrl = defaultAvatar;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
