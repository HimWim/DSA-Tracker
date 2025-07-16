// src/firebase/authService.js

// Import the auth and db instances from the Firebase config file
import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await createUserProfile(user.uid, {
      email: user.email,
      uid: user.uid,
    });
    return userCredential;
  } catch (error) {
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
 * **NEW FUNCTION**
 * Sends a password reset email to a given email address.
 * @param {string} email - The email address to send the reset link to.
 * @returns {Promise<void>} A promise that resolves when the email has been sent.
 */
export const sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
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
 * @param {function} callback - The function to call when the auth state changes.
 * @returns {Unsubscribe} A function to unsubscribe from the listener.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
