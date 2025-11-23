// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyCNJo4SmEqAF04YqUuzWsTkCSnguHSaRfY",
    authDomain: "expense-e2551.firebaseapp.com",
    projectId: "expense-e2551",
    storageBucket: "expense-e2551.firebasestorage.app",
    messagingSenderId: "592796593834",
    appId: "1:592796593834:web:fcaae88f7cd8a88bcb2ad3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
