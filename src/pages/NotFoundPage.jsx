// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A page component to display when a user navigates to a non-existent route.
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-9xl font-bold text-indigo-500">404</h1>
      <h2 className="text-4xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
