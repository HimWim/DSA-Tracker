// src/components/dashboard/Leaderboard.jsx

import React from 'react';

/**
 * Displays a ranked leaderboard of all competitors.
 * @param {object} props - The component props.
 * @param {Array<object>} props.leaderboardData - An array of user data objects, pre-sorted by score.
 * @param {string} props.currentUserId - The UID of the currently logged-in user, for highlighting.
 */
const Leaderboard = ({ leaderboardData, currentUserId }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-800">
            <tr className="border-b-2 border-gray-700">
              <th className="p-3 text-lg font-semibold">Rank</th>
              <th className="p-3 text-lg font-semibold">Competitor</th>
              <th className="p-3 text-lg font-semibold text-right">Problems Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((competitor, index) => (
                <tr
                  key={competitor.uid}
                  // Highlight the current user's row
                  className={`border-b border-gray-700 transition-colors duration-300 ${
                    competitor.uid === currentUserId
                      ? 'bg-indigo-900/50'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <td className="p-3 text-xl font-bold w-1/6">{index + 1}</td>
                  <td className="p-3 text-lg">{competitor.anonymousName}</td>
                  <td className="p-3 text-lg font-bold text-right">
                    {competitor.dsaProblemsSolved}
                  </td>
                </tr>
              ))
            ) : (
              // Display a message if the leaderboard is empty
              <tr>
                <td colSpan="3" className="text-center p-8 text-gray-400">
                  No competitors on the board yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
