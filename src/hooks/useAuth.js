import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to retrieve AuthContext details.
 * Provides user profile state, login, register, and logout utilities.
 * @returns {object} AuthContext values.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
