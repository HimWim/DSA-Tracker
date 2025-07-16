// src/firebase/authService.js

// Import the auth and db instances from the Firebase config file
import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Import the firestore service to create user documents on signup
import { createUserProfile } from "./firestoreService";

/**
 * Signs up a new user with email and password, and creates their profile in Firestore.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential object.
 * @throws {FirebaseError} Throws an error if signup fails.
 */
export const signUp = async (email, password) => {
  try {
    // Step 1: Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Step 2: Create the corresponding user document in Firestore
    // This includes generating their unique anonymous name.
    await createUserProfile(user.uid, {
      email: user.email,
      uid: user.uid,
    });

    return userCredential;
  } catch (error) {
    // Log the error for debugging and re-throw it to be handled by the UI
    console.error("Error during sign up: ", error.message);
    throw error;
  }
};

/**
 * Signs in an existing user with their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential object.
 * @throws {FirebaseError} Throws an error if sign-in fails.
 */
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>} A promise that resolves when the user has been signed out.
 */
export const logout = () => {
  return signOut(auth);
};

/**
 * Subscribes to changes in the user's authentication state.
 * This is a direct wrapper around onAuthStateChanged.
 * @param {function} callback - The function to call when the auth state changes.
 * It receives the user object (or null) as an argument.
 * @returns {Unsubscribe} A function to unsubscribe from the listener.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
