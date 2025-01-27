"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create a new context for authentication
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application and provides authentication context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 */
export function AuthProvider({ children }) {
  // State to hold the currently authenticated user
  const [user, setUser] = useState(null);

  // On component mount, check localStorage for existing user session
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if running in browser environment
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          // Attempt to parse and restore the stored user data
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            token: storedToken
          });
        } catch (e) {
          console.error("Error restoring auth state:", e);
          // Clear invalid stored data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    }
  }, []);

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Registration response data
   */
  async function register(username, email, password) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    const userData = {
      _id: data.userId,
      username,
      email,
      token: data.token,
    };

    setUser(userData);
    // Persist user session in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    return data;
  }

  /**
   * Log in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response data
   */
  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    const userData = {
      _id: data.user._id,
      username: data.user.username,
      email: data.user.email,
      token: data.token,
    };

    setUser(userData);
    // Persist user session in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    return data;
  }

  /**
   * Log out the current user
   */
  function logout() {
    setUser(null);
    // Clear stored session data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // Debug logging for development
  useEffect(() => {
    console.log("Current auth state:", user);
  }, [user]);

  // Create context value object with authentication methods
  const value = {
    user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
