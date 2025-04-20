import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:3000/api/v1';
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (!API_URL) {
        throw new Error('API URL is not defined in environment variables');
      }

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
      } else {
        throw new Error('Invalid login response from server');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data?.msg || err.message);
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      if (!API_URL) {
        throw new Error('API URL is not defined in environment variables');
      }

      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });

      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
      } else {
        throw new Error('Invalid registration response from server');
      }
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.msg || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
}
