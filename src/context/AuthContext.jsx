// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthChange } from '../firebase/authService';
import { db } from '../firebase/config';

// Create the context object
export const AuthContext = createContext();

// A helper to get the application ID
const appId = typeof __app_id !== 'undefined' ? __app_id : 'dsa-tracker-app';

// Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;

    const authUnsubscribe = onAuthChange((authUser) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      if (authUser) {
        setUser(authUser);
        
        const userDocRef = doc(db, `/artifacts/${appId}/public/data/users`, authUser.uid);
        
        profileUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
          setUserData(docSnap.exists() ? docSnap.data() : null);
          setLoading(false);
        }, (error) => {
            console.error("Error listening to user profile:", error);
            setUserData(null);
            setLoading(false);
        });

      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  // The value that will be available to all consuming components
  const value = { user, userData, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
