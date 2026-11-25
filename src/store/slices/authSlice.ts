import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/banking";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isHydrated = true;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.setItem("bank_token", action.payload.token);
        localStorage.setItem("bank_user", JSON.stringify(action.payload.user));
      }
    },
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("bank_token");
        const userStr = localStorage.getItem("bank_user");
        if (token && userStr) {
          try {
            state.token = token;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch {
            localStorage.removeItem("bank_token");
            localStorage.removeItem("bank_user");
          }
        }
      }
      state.isHydrated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("bank_token");
        localStorage.removeItem("bank_user");
      }
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCredentials,
  hydrateAuth,
  clearCredentials,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;

