// src/firebase/firestoreService.js

import { db } from "./config";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  query,
  onSnapshot,
  increment,
  writeBatch,
} from "firebase/firestore";

const appId = typeof __app_id !== "undefined" ? __app_id : "dsa-tracker-app";

/**
 * Creates a new user profile document after checking for username uniqueness.
 * @param {string} userId - The unique ID of the user from Firebase Auth.
 * @param {string} username - The user's chosen username.
 * @param {object} data - Additional user data, e.g., { email, uid }.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the username is already taken.
 */

export const createUserProfile = async (userId, username, data) => {
  // 1. Create a reference to the document in the 'usernames' collection.
  // We use the chosen username as the document ID for efficient lookups.
  const usernameDocRef = doc(db, "usernames", username);
  const docSnap = await getDoc(usernameDocRef);

  // 2. Check if a document with that username already exists.
  if (docSnap.exists()) {
    // If it exists, the name is taken. Throw an error to stop the signup process.
    throw new Error(
      `Username "${username}" is already taken. Please choose another.`
    );
  }

  // 3. If the name is available, proceed with creating the user profile.
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  const userProfile = {
    ...data,
    anonymousName: username, // We'll keep the field name 'anonymousName' for consistency
    dsaProblemsSolved: 0,
  };

  // Use a batch write to make the operation atomic (all or nothing)
  const batch = writeBatch(db);
  batch.set(userDocRef, userProfile); // Create the user's profile
  batch.set(usernameDocRef, { userId: userId }); // Reserve the username

  // Commit both writes to the database
  await batch.commit();
};

/**
 * **NEW FUNCTION**
 * Deletes all of a user's data from Firestore in a single atomic operation.
 * @param {string} userId - The ID of the user to delete.
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<void>}
 */
export const deleteUserData = async (userId, username) => {
  const batch = writeBatch(db);

  // Reference to the user's main profile document
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  batch.delete(userDocRef);

  // Reference to the document reserving their username
  const usernameDocRef = doc(db, "usernames", username);
  batch.delete(usernameDocRef);

  // Commit both delete operations
  await batch.commit();
};

export const updateUserProgress = (userId, problemsToAdd) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  return updateDoc(userDocRef, {
    dsaProblemsSolved: increment(problemsToAdd),
  });
};

export const decreaseUserProgress = (userId, problemsToDecrease) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  return updateDoc(userDocRef, {
    dsaProblemsSolved: increment(-problemsToDecrease),
  });
};

export const getUserProfile = async (userId) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const onLeaderboardUpdate = (callback) => {
  const usersColRef = collection(db, `/artifacts/${appId}/public/data/users`);
  const q = query(usersColRef);
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      usersList.sort((a, b) => b.dsaProblemsSolved - a.dsaProblemsSolved);
      callback(usersList);
    },
    (error) => {
      console.error("Error fetching leaderboard: ", error);
      callback([], error);
    }
  );
  return unsubscribe;
};
