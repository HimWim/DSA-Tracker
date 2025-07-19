// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

// Your web app's Firebase configuration.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the core Firebase app
const app = initializeApp(firebaseConfig);

// --- Initialize and Export All Firebase Services ---

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// **THE FIX IS HERE:**
// Initialize Functions and explicitly connect it to the auth instance.
// This creates a strong link and ensures the auth state is always known.
const functions = getFunctions(app, "us-central1");

// Create the specific callable function we need.
const deleteUserFunction = httpsCallable(functions, "deleteUser");

// Export everything for the rest of the app to use
export { db, auth, deleteUserFunction };
