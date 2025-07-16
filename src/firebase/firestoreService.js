// src/firebase/firestoreService.js

// Import the db instance from the Firebase config file
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

// Import the ASYNCHRONOUS anonymous name generator
import { generateAnonymousName } from "../utils/nameGenerator";

// A helper to get the application ID from the global scope or use a default
const appId = typeof __app_id !== "undefined" ? __app_id : "dsa-tracker-app";

/**
 * Creates a new user profile document in Firestore upon signup.
 * It ensures the generated anonymous name is unique in the database.
 * @param {string} userId - The unique ID of the user from Firebase Auth.
 * @param {object} data - Additional user data, e.g., { email, uid }.
 * @returns {Promise<void>} A promise that resolves when the profile has been created.
 */
export const createUserProfile = async (userId, data) => {
  let anonymousName;
  let isUnique = false;

  // Loop until a unique name is found
  while (!isUnique) {
    // generateAnonymousName is now an async function that calls an API
    anonymousName = await generateAnonymousName();

    if (anonymousName) {
      // To check for uniqueness, we'll look for a document with the name as its ID
      // in a dedicated 'usernames' collection. This is more efficient than querying all users.
      const nameCheckRef = doc(db, "usernames", anonymousName);
      const docSnap = await getDoc(nameCheckRef);
      if (!docSnap.exists()) {
        isUnique = true;
      }
    } else {
      // Handle case where the name generation API fails
      throw new Error("Could not generate a unique name. Please try again.");
    }
  }

  // Use a batch write to perform multiple operations atomically
  const batch = writeBatch(db);

  // 1. Set the main user profile document
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  const userProfile = {
    ...data,
    anonymousName,
    dsaProblemsSolved: 0, // Start with 0 problems solved
  };
  batch.set(userDocRef, userProfile);

  // 2. Create a document in the 'usernames' collection to reserve the name
  const usernameDocRef = doc(db, "usernames", anonymousName);
  batch.set(usernameDocRef, { userId: userId });

  // Commit the batch write
  await batch.commit();
};

/**
 * Updates the number of DSA problems a user has solved.
 * Uses Firestore's atomic 'increment' operation to prevent race conditions.
 * @param {string} userId - The ID of the user to update.
 * @param {number} problemsToAdd - The number of new problems to add to the existing count.
 * @returns {Promise<void>} A promise that resolves when the count has been updated.
 */
export const updateUserProgress = (userId, problemsToAdd) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  return updateDoc(userDocRef, {
    dsaProblemsSolved: increment(problemsToAdd),
  });
};

/**
 * Fetches a single user's profile data from Firestore.
 * @param {string} userId - The ID of the user whose profile to fetch.
 * @returns {Promise<object|null>} A promise that resolves with the user's data, or null if not found.
 */
export const getUserProfile = async (userId) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such user profile!");
    return null;
  }
};

/**
 * Sets up a real-time listener for the leaderboard.
 * It fetches all user profiles and calls the callback function with the sorted data.
 * @param {function} callback - The function to call with the leaderboard data.
 * @returns {Unsubscribe} A function to unsubscribe from the listener to prevent memory leaks.
 */
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

      // Sort users by problems solved in descending order before sending to the UI
      usersList.sort((a, b) => b.dsaProblemsSolved - a.dsaProblemsSolved);

      // Pass the sorted list to the callback function
      callback(usersList);
    },
    (error) => {
      console.error("Error fetching leaderboard: ", error);
      callback([], error);
    }
  );

  return unsubscribe;
};
