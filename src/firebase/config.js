// src/firebase/config.js

// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- Firebase Configuration ---
// Web app's Firebase configuration.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- Initialize Firebase ---
// Initialize the Firebase app with the configuration object.
// This 'app' object is the central point of contact with your Firebase project.
const app = initializeApp(firebaseConfig);

// --- Initialize Services & Export ---
// Initialize Cloud Firestore and get a reference to the service.
// We export this 'db' instance to use it for all database operations (read, write, etc.).
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service.
// We export this 'auth' instance to use it for all authentication tasks (signup, login, etc.).
export const auth = getAuth(app);

// You can also export the main 'app' object if needed elsewhere, though it's less common.
export default app;
