import api from './api';

/**
 * Fetch all available subjects.
 * @returns {Promise} Axios response promise containing the list of subjects.
 */
export const getSubjects = () => {
  return api.get('/public/subjects');
};

/**
 * Fetch a paginated list of tutors based on filters.
 * @param {object} params Search and page parameters.
 * @returns {Promise} Axios response promise containing the paginated list of tutors.
 */
export const getTutors = (params) => {
  return api.get('/public/tutors', { params });
};

/**
 * Fetch a specific tutor's public profile by ID.
 * @param {string|number} id Tutor ID.
 * @returns {Promise} Axios response promise containing tutor details.
 */
export const getTutorById = (id) => {
  return api.get(`/public/tutors/${id}`);
};

/**
 * Fetch sorted recommendations based on Heap Priority Queue algorithm.
 * @param {object} params Sort mode, location, subject, and bio keywords.
 * @returns {Promise} Axios response promise containing recommended tutors.
 */
export const getRecommendations = (params) => {
  return api.get('/public/search/recommend', { params });
};

/**
 * Fetch prefix-based autocomplete suggestions from the Trie.
 * @param {string} prefix Search term prefix.
 * @returns {Promise} Axios response promise containing matching terms.
 */
export const getAutocompleteSuggestions = (prefix) => {
  return api.get('/public/search/autocomplete', { params: { prefix } });
};

/**
 * Check and correct queries using Levenshtein distance strategy.
 * @param {string} query Search terms.
 * @returns {Promise} Axios response promise containing suggestion results.
 */
export const checkTypoCorrection = (query) => {
  return api.get('/public/search/correct', { params: { query } });
};

/**
 * Fetch the logged-in tutor's private profile.
 * @returns {Promise} Axios response promise containing tutor profile.
 */
export const getOwnProfile = () => {
  return api.get('/tutors/profile');
};

/**
 * Update the logged-in tutor's profile details.
 * @param {object} profileData Tutor biography, phone, location, and selected subjects.
 * @returns {Promise} Axios response promise.
 */
export const updateOwnProfile = (profileData) => {
  return api.put('/tutors/profile', profileData);
};

/**
 * Request to reveal a tutor's contact phone number. Requires authentication.
 * @param {string|number} id Tutor ID.
 * @returns {Promise} Axios response promise containing the phone number.
 */
export const revealContact = (id) => {
  return api.post(`/tutors/${id}/contact`);
};

/**
 * Create a new subject (Tutor only).
 * @param {string} name Subject name.
 * @returns {Promise} Axios response promise.
 */
export const createSubject = (name) => {
  return api.post('/tutors/subjects', { name });
};
