// src/hooks/useAuth.js

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * A custom hook that provides easy access to the auth context.
 * This is the single point of access for auth state in the app.
 * @returns {object} The auth context value { user, userData, loading }.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
