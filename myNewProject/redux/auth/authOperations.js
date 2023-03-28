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

const { authSignOut, updateUserProfile, authStateChange } = authSlice.actions;

export const register =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      const response = await createUserWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      const user = response.user;

      Toast.show("Ви успішно зареєструвалися!", {
        duration: 3000,
        position: 50,
      });

      await updateProfile(authFirebase.currentUser, {
        displayName: login,
        userId: user.uid,
      });

      const { displayName, uid } = await authFirebase.currentUser;
      console.log("register", displayName, uid);

      const userUpdateProfile = {
        userName: displayName,
        userId: uid,
      };

      dispatch(updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

export const signIn =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      Toast.show(`Ви увійшли в свій акаунт!`, {
        duration: 3000,
        position: 50,
      });
    } catch (error) {
      console.log("error", error);
      console.log("error.code", error.code);
      console.log("error.message", error.message);
    }
  };

export const logOut = () => async (dispatch, getState) => {
  try {
    await signOut(authFirebase);
    dispatch(authSignOut());

    Toast.show("Ви вийшли із свого акаунта!", {
      duration: 3000,
      position: 50,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(authFirebase, (user) => {
    if (user) {
      const userUpdateProfile = {
        userName: user.displayName,
        userId: user.uid,
      };

      dispatch(authStateChange({ stateChange: true }));
      dispatch(updateUserProfile(userUpdateProfile));
    }
  });
};
