// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios'; 


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/me'); 
        setUser(res.data);
      } catch (err) {
        console.error('Fetch user error:', err);
        setUser(null);
        localStorage.removeItem('token'); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // login method: set user and store token
  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); 
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
