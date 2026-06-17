import api from './api';

/**
 * Sign in a user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Axios response promise containing the JWT and user metadata.
 */
export const login = (email, password) => {
  return api.post('/auth/signin', { email, password });
};

/**
 * Register a new user.
 * @param {Object} registrationData - Full registration payload including personal info for tutors.
 * @returns {Promise} Axios response promise.
 */
export const register = (registrationData) => {
  return api.post('/auth/signup', registrationData);
};
