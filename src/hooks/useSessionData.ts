import { useState, useEffect, useCallback } from 'react';

interface SessionDataOptions {
  key: string;
  fetchFunction: () => Promise<any>;
  dependencies?: any[];
}

// Global cache to store data for the entire session
const sessionCache = new Map<string, any>();
const fetchPromises = new Map<string, Promise<any>>();

/**
 * Hook to fetch data only once per session and cache it
 * Prevents multiple API calls for the same data within a session
 */
export const useSessionData = <T = any>(options: SessionDataOptions) => {
  const { key, fetchFunction, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Check if data is already cached
    if (sessionCache.has(key)) {
      setData(sessionCache.get(key));
      setLoading(false);
      return;
    }

    // Check if there's already a fetch in progress
    if (fetchPromises.has(key)) {
      try {
        const result = await fetchPromises.get(key);
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
      return;
    }

    // Start new fetch
    setLoading(true);
    setError(null);

    const fetchPromise = fetchFunction()
      .then((result) => {
        // Cache the result
        sessionCache.set(key, result);
        setData(result);
        setLoading(false);
        return result;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
        throw err;
      })
      .finally(() => {
        // Remove from pending promises
        fetchPromises.delete(key);
      });

    // Store the promise to prevent duplicate requests
    fetchPromises.set(key, fetchPromise);

    try {
      await fetchPromise;
    } catch (err) {
      // Error already handled in the promise
    }
  }, [key, fetchFunction, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    // Clear cache and refetch
    sessionCache.delete(key);
    fetchPromises.delete(key);
    fetchData();
  }, [key, fetchData]);

  const clearCache = useCallback(() => {
    sessionCache.delete(key);
    fetchPromises.delete(key);
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

/**
 * Utility function to clear all session cache
 */
export const clearAllSessionCache = () => {
  sessionCache.clear();
  fetchPromises.clear();
};

/**
 * Utility function to get cached data without triggering a fetch
 */
export const getCachedData = <T = any>(key: string): T | null => {
  return sessionCache.get(key) || null;
};

/**
 * Utility function to check if data is cached
 */
export const isDataCached = (key: string): boolean => {
  return sessionCache.has(key);
};
