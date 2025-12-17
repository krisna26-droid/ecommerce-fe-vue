// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDAyNetLP5p841YlaqWtUMk0KyxoKueIxs",
  authDomain: "timedoor-ecommerce-fe.firebaseapp.com",
  databaseURL: "https://timedoor-ecommerce-fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "timedoor-ecommerce-fe",
  storageBucket: "timedoor-ecommerce-fe.firebasestorage.app",
  messagingSenderId: "344924199668",
  appId: "1:344924199668:web:acb6c68fe5b2e2dfafdca1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;