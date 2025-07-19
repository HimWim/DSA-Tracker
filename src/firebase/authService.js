// src/firebase/authService.js

// Import the auth and db instances from the Firebase config file
import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential, // <-- Import for re-authentication
  EmailAuthProvider, // <-- Import for re-authentication
  deleteUser, // <-- Import for deleting user
} from "firebase/auth";

// Import the firestore service to create user documents on signup
import { createUserProfile } from "./firestoreService";

/**
 * Signs up a new user with email, password, and a chosen username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} username - The user's chosen unique username.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential object.
 * @throws {Error} Throws an error if signup fails or username is taken.
 */
export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Pass the chosen username to the profile creation function
    await createUserProfile(user.uid, username, {
      email: user.email,
      uid: user.uid,
    });

    return userCredential;
  } catch (error) {
    console.error("Error during sign up: ", error.message);
    // Re-throw the error so it can be caught and displayed by the AuthForm
    throw error;
  }
};

/**
 * Signs in an existing user with their email and password.
 */
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sends a password reset email to a given email address.
 */
export const sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Re-authenticates the current user with their password.
 * This is a security measure required before sensitive operations like account deletion.
 * @param {string} password - The user's current password.
 * @returns {Promise<void>}
 */

export const reauthenticate = (password) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, password);
  return reauthenticateWithCredential(user, credential);
};

/**
 * Deletes the currently signed-in user from Firebase Authentication.
 * Must be called after successful re-authentication.
 * @returns {Promise<void>}
 */

export const deleteCurrentUser = () => {
  const user = auth.currentUser;
  return deleteUser(user);
};

/**
 * Signs out the currently authenticated user.
 */
export const logout = () => {
  return signOut(auth);
};

/**
 * Subscribes to changes in the user's authentication state.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
