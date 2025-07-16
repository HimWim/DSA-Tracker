// src/components/dashboard/ProgressUpdater.jsx

import React, { useState } from 'react';
// Import both the increase and decrease functions
import { updateUserProgress, decreaseUserProgress } from '../../firebase/firestoreService';

const ProgressUpdater = ({ userId, currentProgress }) => {
  // State for the "Add" form
  const [problemsToAdd, setProblemsToAdd] = useState('');
  const [addState, setAddState] = useState({ loading: false, error: '', success: '' });

  // State for the "Remove" form
  const [problemsToRemove, setProblemsToRemove] = useState('');
  const [removeState, setRemoveState] = useState({ loading: false, error: '', success: '' });

  const handleAddProgress = async (e) => {
    e.preventDefault();
    const numToAdd = parseInt(problemsToAdd, 10);

    if (isNaN(numToAdd) || numToAdd <= 0) {
      setAddState({ loading: false, error: "Please enter a valid positive number.", success: '' });
      return;
    }

    setAddState({ loading: true, error: '', success: '' });

    try {
      await updateUserProgress(userId, numToAdd);
      setProblemsToAdd('');
      setAddState({ loading: false, error: '', success: `Successfully added ${numToAdd} problems!` });
      setTimeout(() => setAddState(prev => ({ ...prev, success: '' })), 3000);
    } catch (err) {
      console.error("Error adding progress:", err);
      setAddState({ loading: false, error: "Failed to update progress.", success: '' });
    }
  };

  // **NEW HANDLER** for decreasing progress
  const handleRemoveProgress = async (e) => {
    e.preventDefault();
    const numToRemove = parseInt(problemsToRemove, 10);

    if (isNaN(numToRemove) || numToRemove <= 0) {
      setRemoveState({ loading: false, error: "Please enter a valid positive number.", success: '' });
      return;
    }

    // **CRITICAL CHECK:** Prevent the score from going below zero.
    if (numToRemove > currentProgress) {
        setRemoveState({ loading: false, error: `Cannot remove ${numToRemove}. You only have ${currentProgress} problems logged.`, success: '' });
        return;
    }

    setRemoveState({ loading: true, error: '', success: '' });

    try {
      await decreaseUserProgress(userId, numToRemove);
      setProblemsToRemove('');
      setRemoveState({ loading: false, error: '', success: `Successfully removed ${numToRemove} problems.` });
      setTimeout(() => setRemoveState(prev => ({ ...prev, success: '' })), 3000);
    } catch (err) {
      console.error("Error removing progress:", err);
      setRemoveState({ loading: false, error: "Failed to update progress.", success: '' });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="text-center bg-gray-700 p-6 rounded-xl">
          <p className="text-lg text-gray-300">Problems Solved</p>
          <p className="text-6xl font-bold text-indigo-400">{currentProgress ?? 0}</p>
        </div>
      </div>

      {/* Add Progress Form */}
      <form onSubmit={handleAddProgress}>
        <h3 className="text-xl font-semibold mb-3">Update Your Count</h3>
        <input
          type="number"
          value={problemsToAdd}
          onChange={(e) => setProblemsToAdd(e.target.value)}
          placeholder="e.g., 5"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          min="1"
        />
        <button type="submit" disabled={addState.loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400">
          {addState.loading ? 'Adding...' : 'Add to My Count'}
        </button>
        {addState.error && <p className="text-red-400 text-sm mt-2 text-center">{addState.error}</p>}
        {addState.success && <p className="text-green-400 text-sm mt-2 text-center">{addState.success}</p>}
      </form>
      
      <hr className="border-gray-600" />

      {/* Remove Progress Form */}
      <form onSubmit={handleRemoveProgress}>
        <h3 className="text-xl font-semibold mb-3">Correct a Mistake</h3>
        <input
          type="number"
          value={problemsToRemove}
          onChange={(e) => setProblemsToRemove(e.target.value)}
          placeholder="e.g., 2"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          min="1"
        />
        <button type="submit" disabled={removeState.loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-red-400">
          {removeState.loading ? 'Removing...' : 'Remove from My Count'}
        </button>
        {removeState.error && <p className="text-red-400 text-sm mt-2 text-center">{removeState.error}</p>}
        {removeState.success && <p className="text-green-400 text-sm mt-2 text-center">{removeState.success}</p>}
      </form>
    </div>
  );
};

export default ProgressUpdater;
