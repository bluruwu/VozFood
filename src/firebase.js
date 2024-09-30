// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9effy6VZSoVaPDnZH6U3ZUAfe3FMXoKs",
  authDomain: "vozfood-7f7a9.firebaseapp.com",
  projectId: "vozfood-7f7a9",
  storageBucket: "vozfood-7f7a9.appspot.com",
  messagingSenderId: "364564630630",
  appId: "1:364564630630:web:0fbe931eb48d0afa4171a7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth(app)