import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to execute and track Axios HTTP requests.
 * @param {object} initialConfig Axios request config.
 * @param {object} options Options to control auto-execution.
 * @param {boolean} [options.manual=false] Set to true to execute manually via the returned trigger.
 * @returns {object} { data, loading, error, execute }
 */
const useAxios = (initialConfig = {}, options = { manual: false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  const execute = useCallback(async (customConfig = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedConfig = { ...initialConfig, ...customConfig };
      const response = await api(mergedConfig);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initialConfig]);

  useEffect(() => {
    if (!options.manual) {
      execute();
    }
  }, [options.manual]); // Only run auto-execute when manual option changes

  return { data, loading, error, execute };
};

export default useAxios;
