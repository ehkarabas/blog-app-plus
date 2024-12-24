import { createSlice } from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDark: false,
  },

  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

const persistConfig = {
  key: "theme",
  storage,
};

const persistedThemeReducer = persistReducer(persistConfig, themeSlice.reducer);

export const { toggleTheme } = themeSlice.actions;
export default persistedThemeReducer;
