// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBInc-jLMyEY9k22n5_e18T-UcYUlkq5f0",
  authDomain: "ai-authproj.firebaseapp.com",
  projectId: "ai-authproj",
  storageBucket: "ai-authproj.appspot.com",
  messagingSenderId: "815146707612",
  appId: "1:815146707612:web:013627d2cf8837b8ce1b59",
  measurementId: "G-WEHQRNK6EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
