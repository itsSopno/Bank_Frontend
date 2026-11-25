import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "dark" | "light";

interface UiState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  globalSearch: string;
}

const initialState: UiState = {
  theme: "dark", // Default dark theme matching reference fintech UI
  sidebarOpen: false,
  globalSearch: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("bank_theme", state.theme);
        document.documentElement.classList.toggle("dark", state.theme === "dark");
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("bank_theme", action.payload);
        document.documentElement.classList.toggle(
          "dark",
          action.payload === "dark"
        );
      }
    },
    hydrateTheme: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("bank_theme") as ThemeMode | null;
        const theme = saved || "dark";
        state.theme = theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setGlobalSearch: (state, action: PayloadAction<string>) => {
      state.globalSearch = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  hydrateTheme,
  setSidebarOpen,
  setGlobalSearch,
} = uiSlice.actions;

export default uiSlice.reducer;

