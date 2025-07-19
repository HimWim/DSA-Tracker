// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// Import page components
import UserDashboardPage from './pages/UserDashboardPage'; 
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import { useAuth } from './hooks/useAuth';
import Spinner from './components/common/Spinner';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <UserDashboardPage />
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
