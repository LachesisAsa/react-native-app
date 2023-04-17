import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userName: null,
  userAvatar: null,
  userEmail: "",
  stateChange: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchingInProgress: (state) => {
      return { ...state, isLoading: true };
    },
    fetchingError: (state, { payload }) => {
      return { ...state, isLoading: false, error: payload };
    },
    updateUserProfile: (state, { payload }) => {
      return {
        ...state,
        userId: payload.userId,
        userName: payload.userName,
        userAvatar: payload.userAvatar,
        userEmail: payload.userEmail,
        isLoading: false,
        error: null,
      };
    },
    authStateChange: (state, { payload }) => {
      return {
        ...state,
        stateChange: payload.stateChange,
        isLoading: false,
        error: null,
      };
    },
    authSignOut: () => initialState,
  },
});