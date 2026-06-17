import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/auth';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await apiLogin(email, password);
      localStorage.setItem('token', data.token);
      const userData = { id: data.id, email: data.email, role: data.role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register a new user.
   * @param {Object} registrationData - Full registration payload.
   *   For PARENT: { email, password, role }
   *   For TUTOR:  { email, password, role, title, firstName, lastName, gender, dateOfBirth, phoneNumber, address }
   */
  const register = async (registrationData) => {
    try {
      await apiRegister(registrationData);
      toast.success('Registration successful! Please login.');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = { user, login, register, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};