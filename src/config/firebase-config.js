// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrtKdxoQHCQoKvEvQY3d-0-qhhd69JBpM",
  authDomain: "expense-tracker-2f2fe.firebaseapp.com",
  projectId: "expense-tracker-2f2fe",
  storageBucket: "expense-tracker-2f2fe.appspot.com",
  messagingSenderId: "788290763119",
  appId: "1:788290763119:web:1734ce73a75bf88a99909a",
  measurementId: "G-2JS8VBT5SD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);

