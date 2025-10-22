import { useState, useEffect, useCallback } from 'react';

interface FetchControlOptions {
  delayAfterRefresh?: number; // Delay in milliseconds before allowing refetch after refresh
  enableRefetch?: boolean; // Whether to enable refetching after delay
  componentId?: string; // Unique identifier for this component
}

const REFRESH_KEY = 'mmeraki_page_refresh';
const FETCH_DISABLED_KEY = 'mmeraki_fetch_disabled';
const FETCH_QUEUE_KEY = 'mmeraki_fetch_queue';

// Global request queue to prevent rate limiting
let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        // Continue with next request even if one fails
      }
    }
  }
  
  isProcessingQueue = false;
};

export const useFetchControl = (options: FetchControlOptions = {}) => {
  const { delayAfterRefresh = 30000, enableRefetch = true, componentId = 'default' } = options;
  const [canFetch, setCanFetch] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    const checkRefreshStatus = () => {
      const refreshTime = sessionStorage.getItem(REFRESH_KEY);
      const fetchDisabled = sessionStorage.getItem(FETCH_DISABLED_KEY);
      const now = Date.now();

      if (refreshTime) {
        const timeSinceRefresh = now - parseInt(refreshTime);
        
        if (timeSinceRefresh < delayAfterRefresh) {
          // Recently refreshed, disable fetching
          setCanFetch(false);
          setIsRefreshed(true);
          sessionStorage.setItem(FETCH_DISABLED_KEY, 'true');
          
          // Set timeout to re-enable fetching
          const remainingTime = delayAfterRefresh - timeSinceRefresh;
          setTimeout(() => {
            if (enableRefetch) {
              setCanFetch(true);
              setIsRefreshed(false);
              sessionStorage.removeItem(FETCH_DISABLED_KEY);
            }
          }, remainingTime);
        } else {
          // Enough time has passed, allow fetching
          setCanFetch(true);
          setIsRefreshed(false);
          sessionStorage.removeItem(FETCH_DISABLED_KEY);
        }
      } else {
        // No refresh detected, allow fetching immediately
        setCanFetch(true);
        setIsRefreshed(false);
      }
    };

    checkRefreshStatus();

    // Listen for page refresh
    const handleBeforeUnload = () => {
      sessionStorage.setItem(REFRESH_KEY, Date.now().toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [delayAfterRefresh, enableRefetch]);

  const queueRequest = useCallback((request: () => Promise<any>) => {
    if (!canFetch) return Promise.resolve([]);
    
    return new Promise((resolve, reject) => {
      requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      processQueue();
    });
  }, [canFetch]);

  const forceEnableFetch = useCallback(() => {
    setCanFetch(true);
    setIsRefreshed(false);
    sessionStorage.removeItem(FETCH_DISABLED_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  }, []);

  const forceDisableFetch = useCallback(() => {
    setCanFetch(false);
    sessionStorage.setItem(FETCH_DISABLED_KEY, 'true');
  }, []);

  return {
    canFetch,
    isRefreshed,
    queueRequest,
    forceEnableFetch,
    forceDisableFetch
  };
};
