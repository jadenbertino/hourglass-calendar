import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAkcDWebKzJwzlZJQsB4NO08RHVySfkqeo",
  authDomain: "hourglass-calendar.firebaseapp.com",
  projectId: "hourglass-calendar",
  storageBucket: "hourglass-calendar.appspot.com",
  messagingSenderId: "617927885464",
  appId: "1:617927885464:web:4c629a3b793946c3c086ed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);