import { configureStore } from "@reduxjs/toolkit";
import persistedAuthReducer from "../features/authSlice";
import persistedThemeReducer from "../features/themeSlice";
import blogReducer from "../features/blogSlice";

import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.REACT_APP_NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
