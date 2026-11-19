import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geminiKey, setGeminiKeyState] = useState(localStorage.getItem('gym_gemini_key') || '');

  useEffect(() => {
    // Check local stored session
    const savedUser = localStorage.getItem('gym_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('gym_user');
      }
    }
    setLoading(false);
  }, []);

  const setGeminiKey = (key) => {
    setGeminiKeyState(key);
    if (key) {
      localStorage.setItem('gym_gemini_key', key);
    } else {
      localStorage.removeItem('gym_gemini_key');
    }
  };

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    setUser(res.user);
    localStorage.setItem('gym_user', JSON.stringify(res.user));
    localStorage.setItem('gym_token', res.token);
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setUser(res.user);
    localStorage.setItem('gym_user', JSON.stringify(res.user));
    localStorage.setItem('gym_token', res.token);
    return res;
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    setUser(res.user);
    localStorage.setItem('gym_user', JSON.stringify(res.user));
    localStorage.setItem('gym_token', res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gym_user');
    localStorage.removeItem('gym_token');
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const updated = await api.getProfile(user.id);
      setUser(updated);
      localStorage.setItem('gym_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        geminiKey,
        setGeminiKey,
        login,
        register,
        demoLogin,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
