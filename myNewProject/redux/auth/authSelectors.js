export const selectAuth = (state) => state.auth;

export const selectAuthEmail = (state) => state.auth.userEmail;
export const selectUserId = (state) => state.auth.userId;
export const selectUserName = (state) => state.auth.userName;
export const selectAvatar = (state) => state.auth.userAvatar;
export const selectIsLoading = (state) => state.auth.isLoading;

export const selectError = (state) => state.auth.error;