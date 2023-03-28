// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUm43G1jRQnBV5gFPdaVGY5hTW9TAE9w4",
  authDomain: "react-native-app-a390f.firebaseapp.com",
  projectId: "react-native-app-a390f",
  storageBucket: "react-native-app-a390f.appspot.com",
  messagingSenderId: "559980396718",
  appId: "1:559980396718:web:6ef0fb952cbedbf88b2d3f",
  measurementId: "G-EZK1ZYGWLX"
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication and get a reference to the service
export const authFirebase = getAuth(initializeApp(firebaseConfig));
export const db = getFirestore(initializeApp(firebaseConfig));
export const storage = getStorage(initializeApp(firebaseConfig));
