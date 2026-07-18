import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const { data } = await api.get('/api/users/profile');
          setUser(data);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('accessToken', data.accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/api/auth/admin-login', { email, password });
    setUser(data);
    localStorage.setItem('accessToken', data.accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfileData = (newData) => {
    setUser({ ...user, ...newData });
  };

  const value = {
    user,
    login,
    adminLogin,
    register,
    logout,
    updateProfileData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
