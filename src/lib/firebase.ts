// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAim4PGkNJD6YkOs7Vqwi9vQKjK51r1-_A",
  authDomain: "indie-circuit.firebaseapp.com",
  projectId: "indie-circuit",
  storageBucket: "indie-circuit.firebasestorage.app",
  messagingSenderId: "454564080880",
  appId: "1:454564080880:web:e89933d343e94b647a6635"
};

// Initialize Firebase (Singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };