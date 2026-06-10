import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("pem_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const t = await api.login({ email, password });
      localStorage.setItem("pem_token", t);
      setToken(t);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(email, username, password) {
    setLoading(true);
    setError(null);
    try {
      await api.register({ email, username, password });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("pem_token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
