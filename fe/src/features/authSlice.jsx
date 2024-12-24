import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import ErrorCatcher from "../helper/ErrorCatch";
import { toastSuccessNotify } from "../helper/ToastNotify";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, thunkAPI) => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const { getState, rejectWithValue } = thunkAPI;
    try {
      const response = await axios.get(`${BASE_URL}auth/refresh_others/`, {
        headers: {
          "X-Refresh-Token": refreshToken,
          "Content-Type": "application/json",
        },
      });

      const { data } = response;
      toastSuccessNotify("Your token has been successfully renewed.");
      return data.bearer.access;
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    currentUser: null,
    id: null,
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    image: "",
    token: null,
    isActive: false,
    isStaff: false,
    isAdmin: false,
    loading: false,
    error: false,
  },

  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.currentUser = payload?.user?.username;
      state.id = payload?.user?._id;
      state.email = payload?.user?.email;
      state.firstName = payload?.user?.firstName;
      state.lastName = payload?.user?.lastName;
      state.bio = payload?.user?.bio;
      state.image = payload?.user?.image;
      state.isActive = payload?.user?.isActive;
      state.isStaff = payload?.user?.isStaff;
      state.isAdmin = payload?.user?.isAdmin;
      state.token = payload?.token;
      state.accessToken = payload?.bearer?.access;
      state.refreshToken = payload?.bearer?.refresh;
    },
    logoutSuccess: (state) => {
      state.error = false;
      state.loading = false;
      state.currentUser = null;
      state.id = null;
      state.email = "";
      state.firstName = "";
      state.lastName = "";
      state.bio = "";
      state.image = "";
      state.isActive = false;
      state.isAdmin = false;
      state.isStaff = false;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    registerSuccess: (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.currentUser = payload?.result?.username;
      state.id = payload?.result?._id;
      state.email = payload?.result?.email;
      state.firstName = payload?.result?.firstName;
      state.lastName = payload?.result?.lastName;
      state.bio = payload?.result?.bio;
      state.image = payload?.result?.image;
      state.isActive = payload?.result?.isActive;
      state.isStaff = payload?.result?.isStaff;
      state.isAdmin = payload?.result?.isAdmin;
      state.token = payload?.token;
      state.accessToken = payload?.bearer?.access;
      state.refreshToken = payload?.bearer?.refresh;
    },
    fetchFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    fetchSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/resetLoading", (state) => {
      state.loading = false;
      state.error = false;
    });
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload; // action.payload burada yeni accessToken olacaktır.
        state.loading = false; // İşlem tamamlandığında loading durumunu false yapabiliriz.
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true; // İstek başladığında loading'i true yapabiliriz.
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload; // Hata durumunda error bilgisini güncelleyebiliriz.
        state.loading = false; // İşlem tamamlandığında loading durumunu false yapabiliriz.
      });
  },
});

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

export const {
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  fetchFail,
  fetchSuccess,
} = authSlice.actions;
export const authResetLoading = { type: "auth/resetLoading" };
export default persistedAuthReducer;
