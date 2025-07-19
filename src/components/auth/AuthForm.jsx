// src/components/auth/AuthForm.jsx

import React, { useState } from 'react';
import { signIn, signUp, sendPasswordReset } from '../../firebase/authService';

const AuthForm = () => {
  const [formMode, setFormMode] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // <-- State for the new username field
  
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
        if (password.length < 6) throw new Error("Password must be at least 6 characters long.");
        if (!username || username.length < 3) throw new Error("Username must be at least 3 characters long.");
        // Pass the new username to the signUp function
        await signUp(email, password, username);
      } else if (formMode === 'reset') {
        await sendPasswordReset(email);
        setSuccess("Password reset email sent! Please check your inbox.");
        setTimeout(() => switchMode('login'), 4000);
      }
    } catch (err) {
      // This will now catch errors from both Firebase Auth and our custom username check
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setFormMode(mode);
    setError('');
    setSuccess('');
    setPassword('');
    setUsername(''); // <-- Clear username when switching modes
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
          {/* Email input (always visible) */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="you@example.com" />
          </div>

          {/* Username input (only for signup) */}
          {formMode === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="username">Choose a Username</label>
              <p className="text-xs text-violet-400 mb-2">This is your public name. Please do not use your real name.</p>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required minLength="3" placeholder="e.g., CodeNinja7" />
            </div>
          )}

          {/* Password input (not for reset) */}
          {formMode !== 'reset' && (
            <div className="mb-6">
              <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required={formMode !== 'reset'} placeholder="••••••••" minLength="6" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {loading && 'Processing...'}
            {!loading && formMode === 'login' && 'Login'}
            {!loading && formMode === 'signup' && 'Create Account'}
            {!loading && formMode === 'reset' && 'Send Reset Email'}
          </button>
        </form>

        {/* --- Form switching UI --- */}
        {formMode === 'login' && (
          <div className="text-center mt-4">
            <button onClick={() => switchMode('reset')} className="text-sm text-indigo-400 hover:text-indigo-300">Forgot Password?</button>
          </div>
        )}
        {formMode === 'reset' && (
           <div className="text-center mt-4">
            <button onClick={() => switchMode('login')} className="text-sm text-indigo-400 hover:text-indigo-300">Back to Login</button>
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
