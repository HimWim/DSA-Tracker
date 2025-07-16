// src/components/auth/AuthForm.jsx

import React, { useState } from 'react';
// Import the authentication service functions, including the new one
import { signIn, signUp, sendPasswordReset } from '../../firebase/authService';

const AuthForm = () => {
  // State to manage which form is shown: 'login', 'signup', or 'reset'
  const [formMode, setFormMode] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (formMode === 'login') {
        await signIn(email, password);
      } else if (formMode === 'signup') {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        await signUp(email, password);
      } else if (formMode === 'reset') {
        await sendPasswordReset(email);
        setSuccess("Password reset email sent! Please check your inbox.");
      }
    } catch (err) {
      let friendlyError = "An unknown error occurred. Please try again.";
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            friendlyError = "Invalid email or password. Please try again.";
            break;
          case 'auth/email-already-in-use':
            friendlyError = "An account with this email already exists. Please login.";
            break;
          case 'auth/invalid-email':
            friendlyError = "Please enter a valid email address.";
            break;
          default:
            friendlyError = err.message.replace('Firebase: ', '');
        }
      } else {
        friendlyError = err.message;
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setFormMode(mode);
    setError('');
    setSuccess('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-400">DSA Tracker</h1>
        <p className="text-gray-400">Compete with your colleagues anonymously</p>
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          {formMode === 'login' && 'Login'}
          {formMode === 'signup' && 'Create Account'}
          {formMode === 'reset' && 'Reset Password'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="you@example.com"
            />
          </div>
          {formMode !== 'reset' && (
            <div className="mb-6">
              <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={formMode !== 'reset'}
                placeholder="••••••••"
                minLength="6"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading && 'Processing...'}
            {!loading && formMode === 'login' && 'Login'}
            {!loading && formMode === 'signup' && 'Create Account'}
            {!loading && formMode === 'reset' && 'Send Reset Email'}
          </button>
        </form>

        {formMode === 'login' && (
          <div className="text-center mt-4">
            <button onClick={() => switchMode('reset')} className="text-sm text-indigo-400 hover:text-indigo-300">
              Forgot Password?
            </button>
          </div>
        )}

        {formMode === 'reset' && (
           <div className="text-center mt-4">
            <button onClick={() => switchMode('login')} className="text-sm text-indigo-400 hover:text-indigo-300">
              Back to Login
            </button>
          </div>
        )}

        <p className="text-center mt-6 text-gray-400">
          {formMode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => switchMode(formMode === 'login' ? 'signup' : 'login')} className="text-indigo-400 hover:text-indigo-300 font-bold ml-2">
            {formMode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
