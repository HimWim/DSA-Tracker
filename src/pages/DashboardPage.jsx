// src/pages/DashboardPage.jsx

import React from 'react';
// Import the custom hooks to manage state and data fetching
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
// Import the authentication service for the logout function
import { logout } from '../firebase/authService';

// Import the UI components that make up this page
import Header from '../components/common/Header';
import Spinner from '../components/common/Spinner';
import Leaderboard from '../components/dashboard/Leaderboard';
import ProgressUpdater from '../components/dashboard/ProgressUpdater';

const DashboardPage = () => {
  // Use our custom hooks to get user data and leaderboard data
  const { user, userData } = useAuth();
  const { leaderboardData, loading: leaderboardLoading } = useLeaderboard();

  // A simple loading check to ensure we have user data before rendering
  if (!user || !userData) {
    // This can be shown briefly while the useAuth hook is fetching the user profile
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      // After logout, the router or main App component will handle redirecting the user.
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      {/* The Header component displays user info and the logout button */}
      <Header userData={userData} onLogout={handleLogout} />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* The ProgressUpdater component for the logged-in user */}
        <div className="lg:col-span-1">
          <ProgressUpdater
            userId={user.uid}
            currentProgress={userData.dsaProblemsSolved}
          />
        </div>

        {/* The Leaderboard component to show all competitors */}
        <div className="lg:col-span-2">
          {leaderboardLoading ? (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <Leaderboard
              leaderboardData={leaderboardData}
              currentUserId={user.uid}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
