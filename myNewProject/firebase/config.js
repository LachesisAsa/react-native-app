// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCsb5rjwIAcm80Un6YcnbrXzn17vGutB0",
  authDomain: "mynewprojectapprn.firebaseapp.com",
  projectId: "mynewprojectapprn",
  storageBucket: "mynewprojectapprn.appspot.com",
  messagingSenderId: "210155614054",
  appId: "1:210155614054:web:e50cac9ef808ae97fbe2a7",
  measurementId: "G-ZD8RZ8VTTD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const authFirebase = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);