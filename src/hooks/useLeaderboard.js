// src/hooks/useLeaderboard.js

import { useState, useEffect } from "react";
// Import our custom firestore service function
import { onLeaderboardUpdate } from "../firebase/firestoreService";

/**
 * A custom React Hook to manage fetching and real-time updates for the leaderboard.
 * @returns {object} An object containing the leaderboard data and a loading state.
 * - leaderboardData: An array of user objects, sorted by score.
 * - loading: A boolean indicating if the initial data fetch is in progress.
 */
export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onLeaderboardUpdate returns an unsubscribe function from Firebase.
    // We pass it a callback function to handle the incoming data.
    const unsubscribe = onLeaderboardUpdate((data, error) => {
      if (error) {
        console.error("Failed to get leaderboard updates:", error);
        setLoading(false);
        return;
      }

      setLeaderboardData(data);
      setLoading(false);
    });

    // Cleanup subscription on component unmount to prevent memory leaks
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return { leaderboardData, loading };
};
