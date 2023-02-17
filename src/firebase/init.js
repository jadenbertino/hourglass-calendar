// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLO23uwJKUcAbGEunt78JWpS5XAMf6Ghs",
  authDomain: "calendar-b8161.firebaseapp.com",
  projectId: "calendar-b8161",
  storageBucket: "calendar-b8161.appspot.com",
  messagingSenderId: "426904028039",
  appId: "1:426904028039:web:3974d20adb96d4c0744922"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);