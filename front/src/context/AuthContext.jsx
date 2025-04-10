import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const { data } = await api.get('/user');
          setUser({
            email: data.email,
            role: data.role
          });
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      const userResponse = await api.get('/user');
      setUser({
        email: userResponse.data.email,
        role: userResponse.data.role
      });
      return userResponse.data.role;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    await api.post('/register', { name, email, password, role });
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};