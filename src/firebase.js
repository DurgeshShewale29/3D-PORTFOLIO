import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6rEPD-W1gZZV5X6D3dkjS2hm95bPDApw",
  authDomain: "portfolio-7a69a.firebaseapp.com",
  projectId: "portfolio-7a69a",
  storageBucket: "portfolio-7a69a.firebasestorage.app",
  messagingSenderId: "366033934638",
  appId: "1:366033934638:web:9663d0722d33c545ce82bf",
  measurementId: "G-FCF2H1GPLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
