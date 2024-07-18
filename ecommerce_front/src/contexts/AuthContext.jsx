// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(token);
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth(token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
