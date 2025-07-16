// src/pages/LoginPage.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// Import the custom hook to check authentication status
import { useAuth } from '../hooks/useAuth';

// Import the UI components for this page
import AuthForm from '../components/auth/AuthForm';
import Spinner from '../components/common/Spinner';

const LoginPage = () => {
  // Get the current user and loading status from our auth hook
  const { user, loading } = useAuth();

  // 1. Show a spinner while the auth state is being determined
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // 2. If the user is already logged in, redirect them to the dashboard
  if (user) {
    // The 'replace' prop prevents the user from navigating back to the login page
    return <Navigate to="/" replace />;
  }

  // 3. If the user is not logged in, show the authentication form
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <AuthForm />
    </div>
  );
};

export default LoginPage;
