import { authFirebase } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import Toast from "react-native-root-toast";
import { authSlice } from "./authReducer";

const {
  authSignOut,
  updateUserProfile,
  authStateChange,
  fetchingError,
  fetchingInProgress,
} = authSlice.actions;

export const register =
  ({ email, password, login, avatar }) =>
  async (dispatch, getState) => {
    try {
      dispatch(fetchingInProgress());
      const response = await createUserWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      const user = response.user;

      Toast.show("Ви успішно зареєструвалися", {
        duration: 3000,
        position: 50,
      });

      await updateProfile(authFirebase.currentUser, {
        displayName: login,
        userId: user.uid,
        photoURL: avatar,
      });

      const { displayName, uid, photoURL } = await authFirebase.currentUser;

      const userUpdateProfile = {
        userName: displayName,
        userId: uid,
        userAvatar: photoURL,
        userEmail: email,
      };

      dispatch(updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log("error.message", error.message);
      dispatch(fetchingError(error.message));
    }
  };

export const signIn =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      dispatch(fetchingInProgress());
      const user = await signInWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      const { displayName, uid, photoURL } = user.user;

      const userUpdateProfile = {
        userName: displayName,
        userId: uid,
        userAvatar: photoURL,
        userEmail: email,
      };

      dispatch(updateUserProfile(userUpdateProfile));

      Toast.show(`Вхід виконано!!`, {
        duration: 3000,
        position: 50,
      });
    } catch (error) {
      dispatch(fetchingError(error.message));
      console.log("error.message", error.message);
    }
  };

export const deleteAvatar = () => async (dispatch, getState) => {
  try {
    dispatch(fetchingInProgress());
    console.log(authFirebase.currentUser);
    await updateProfile(authFirebase.currentUser, {
      displayName,
      userId: uid,
      photoURL: null,
    });

    const { displayName, uid, photoURL, email } =
      await authFirebase.currentUser;

    console.log("photo", photoURL);

    const userUpdateProfile = {
      userName: displayName,
      userId: uid,
      userAvatar: null,
      userEmail: email,
    };

    dispatch(updateUserProfile(userUpdateProfile));

    Toast.show(`Аватар видалено!!`, {
      duration: 3000,
      position: 50,
    });
  } catch (error) {
    dispatch(fetchingError(error.message));
    console.log("error.message", error.message);
  }
};

export const logOut = () => async (dispatch, getState) => {
  try {
    dispatch(fetchingInProgress());
    await signOut(authFirebase);
    dispatch(authSignOut());

    Toast.show("Виконаний вихід з акаунта!", {
      duration: 3000,
      position: 50,
    });
  } catch (error) {
    console.log("error", error);
    dispatch(fetchingError(error.message));
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        const userUpdateProfile = {
          userName: user.displayName,
          userId: user.uid,
          userAvatar: user.photoURL,
          userEmail: user.email,
        };
        dispatch(fetchingInProgress());
        dispatch(authStateChange({ stateChange: true }));
        dispatch(updateUserProfile(userUpdateProfile));
      }
    });
  } catch (error) {
    dispatch(fetchingError(error.message));
    console.log("error", error.message);
  }
};
