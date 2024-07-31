// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH4drK5vVrBmhNI4cipk08uI4nWzfFDaE",
  authDomain: "monkey-blogging-efeed.firebaseapp.com",
  projectId: "monkey-blogging-efeed",
  storageBucket: "monkey-blogging-efeed.appspot.com",
  messagingSenderId: "284339106676",
  appId: "1:284339106676:web:91e63c19b4b072ef4a3221",
  measurementId: "G-2B3MKC886L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
