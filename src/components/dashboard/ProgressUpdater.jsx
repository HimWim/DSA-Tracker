// src/components/dashboard/ProgressUpdater.jsx

import React, { useState } from 'react';
import { updateUserProgress } from '../../firebase/firestoreService';

/**
 * A component that displays the user's current progress and allows them to update it.
 * @param {object} props - The component props.
 * @param {string} props.userId - The UID of the currently logged-in user.
 * @param {number} props.currentProgress - The user's current number of solved problems.
 */
const ProgressUpdater = ({ userId, currentProgress }) => {
  const [newProblems, setNewProblems] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    const problemsToAdd = parseInt(newProblems, 10);

    if (isNaN(problemsToAdd) || problemsToAdd <= 0) {
      setError("Please enter a valid positive number.");
      setSuccess('');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProgress(userId, problemsToAdd);
      setNewProblems('');
      setSuccess(`Successfully added ${problemsToAdd} problems!`);
      // Clear success message after a few seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error updating progress:", err);
      setError("Failed to update progress. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      
      <div className="text-center bg-gray-700 p-6 rounded-xl mb-6">
        <p className="text-lg text-gray-300">Problems Solved</p>
        <p className="text-6xl font-bold text-indigo-400">{currentProgress ?? 0}</p>
      </div>

      <form onSubmit={handleUpdateProgress}>
        <h3 className="text-xl font-semibold mb-3">Update Your Count</h3>
        <p className="text-sm text-gray-400 mb-3">Add the number of new problems you have solved.</p>
        <input
          type="number"
          value={newProblems}
          onChange={(e) => setNewProblems(e.target.value)}
          placeholder="e.g., 5"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          min="1"
          required
        />
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {updating ? 'Updating...' : 'Add to My Count'}
        </button>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-4 text-center">{success}</p>}
      </form>
    </div>
  );
};

export default ProgressUpdater;
