// src/components/common/Header.jsx

import React from 'react';

/**
 * A reusable header component for the application dashboard.
 * @param {object} props - The component props.
 * @param {object} props.userData - The data object for the currently logged-in user.
 * @param {string} props.userData.anonymousName - The user's anonymous display name.
 * @param {function} props.onLogout - The function to call when the logout button is clicked.
 */
const Header = ({ userData, onLogout }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-indigo-400">
          {/* Display a welcome message, with a fallback if userData is not yet loaded */}
          Welcome, {userData?.anonymousName || 'User'}
        </h1>
        {/* The User ID line has been removed from here */}
      </div>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full sm:w-auto"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
