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

  while (!isUnique) {
    anonymousName = await generateAnonymousName();
    if (anonymousName) {
      const nameCheckRef = doc(db, "usernames", anonymousName);
      const docSnap = await getDoc(nameCheckRef);
      if (!docSnap.exists()) {
        isUnique = true;
      }
    } else {
      throw new Error("Could not generate a unique name. Please try again.");
    }
  }

  const batch = writeBatch(db);
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  const userProfile = {
    ...data,
    anonymousName,
    dsaProblemsSolved: 0,
  };
  batch.set(userDocRef, userProfile);

  const usernameDocRef = doc(db, "usernames", anonymousName);
  batch.set(usernameDocRef, { userId: userId });

  await batch.commit();
};

/**
 * Atomically increases the number of DSA problems a user has solved.
 * @param {string} userId - The ID of the user to update.
 * @param {number} problemsToAdd - The number of new problems to add.
 * @returns {Promise<void>}
 */
export const updateUserProgress = (userId, problemsToAdd) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  return updateDoc(userDocRef, {
    dsaProblemsSolved: increment(problemsToAdd),
  });
};

/**
 * **NEW FUNCTION**
 * Atomically decreases the number of DSA problems a user has solved.
 * @param {string} userId - The ID of the user to update.
 * @param {number} problemsToDecrease - The number of problems to remove.
 * @returns {Promise<void>}
 */
export const decreaseUserProgress = (userId, problemsToDecrease) => {
  const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, userId);
  // We use increment with a negative value to perform an atomic decrement.
  return updateDoc(userDocRef, {
    dsaProblemsSolved: increment(-problemsToDecrease),
  });
};

/**
 * Fetches a single user's profile data from Firestore.
 * @param {string} userId - The ID of the user whose profile to fetch.
 * @returns {Promise<object|null>}
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
 * @param {function} callback - The function to call with the leaderboard data.
 * @returns {Unsubscribe}
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
