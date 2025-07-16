// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import the AuthProvider to wrap our app
// **FIXED:** The import now correctly points to the .jsx file
import { AuthProvider } from './context/AuthContext.jsx';

// Import page components
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Import the hook and spinner
import { useAuth } from './hooks/useAuth';
import Spinner from './components/common/Spinner';

// PrivateRoute no longer needs to call useAuth itself.
// It will get the auth state from the context via the hook.
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

/**
 * The main App component that defines the application's routing structure.
 */
function App() {
  return (
    // Wrap the entire routing system with the AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
