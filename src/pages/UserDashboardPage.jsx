// src/pages/UserDashboardPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { logout } from '../firebase/authService';
import { deleteUserData } from '../firebase/firestoreService';
import { reauthenticate, deleteCurrentUser } from '../firebase/authService';

import Header from '../components/common/Header';
import Spinner from '../components/common/Spinner';
import Leaderboard from '../components/dashboard/Leaderboard';
import ProgressUpdater from '../components/dashboard/ProgressUpdater';

// Re-using the modal from the Admin page for consistency
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading, error }) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"><div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md m-4"><h2 className="text-2xl font-bold text-red-500 mb-4">Delete Account</h2><p className="text-gray-300 mb-6">This action is irreversible. All your data will be permanently deleted. To confirm, please enter your password.</p><form onSubmit={handleSubmit}><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter your password" required />{error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}<div className="flex justify-end gap-4"><button type="button" onClick={onClose} className="py-2 px-4 text-white rounded-lg hover:bg-gray-700 transition">Cancel</button><button type="submit" disabled={loading} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:bg-red-400">{loading ? 'Deleting...' : 'Delete My Account'}</button></div></form></div></div>
  );
};


const UserDashboardPage = () => {
  const { user, userData } = useAuth();
  const { leaderboardData, loading: leaderboardLoading } = useLeaderboard();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // **THIS IS THE FIX**
  // If the user is logged in but their data hasn't loaded yet, show a spinner.
  // This handles the brief moment during signup where the profile is still being created.
  if (!userData) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDeleteConfirm = async (password) => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await reauthenticate(password);
      await deleteUserData(user.uid, userData.anonymousName);
      await deleteCurrentUser();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Account deletion failed:", error);
      setDeleteError(error.code === 'auth/wrong-password' ? 'Incorrect password.' : 'An error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <Header userData={userData} onLogout={handleLogout} />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProgressUpdater userId={user.uid} currentProgress={userData.dsaProblemsSolved} />
          </div>
          <div className="lg:col-span-2">
            {leaderboardLoading ? <Spinner /> : <Leaderboard leaderboardData={leaderboardData} currentUserId={user.uid} />}
          </div>
        </main>
        <footer className="mt-12 pt-8 border-t border-gray-700">
            <div className="max-w-md mx-auto text-center">
                <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                <p className="text-sm text-gray-400 my-2">Deleting your account is a permanent action.</p>
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Delete Account
                </button>
            </div>
        </footer>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        error={deleteError}
      />
    </>
  );
};

export default UserDashboardPage;
