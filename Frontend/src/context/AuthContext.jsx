import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Set auth token in API headers
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete API.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await API.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      // Throw so callers using try/catch can handle errors consistently
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      // backend uses /auth/signup
      const response = await API.post("/auth/signup", { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Authenticate using an existing token + user object (used after OTP verification)
  const authenticateWithToken = (authToken, authUser) => {
    if (!authToken) return;
    localStorage.setItem("token", authToken);
    setToken(authToken);
    setUser(authUser || null);
    API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    fetchUser,
    authenticateWithToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
