// Global API Rate Limiter
// This ensures all API calls respect rate limits

let requestQueue = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
let requestCount = 0;
let windowStartTime = Date.now();
let circuitBreakerOpen = false;
let circuitBreakerTimeout = null;
let consecutiveFailures = 0;

const MIN_REQUEST_INTERVAL = 100; // 100ms between requests (balanced)
const MAX_REQUESTS_PER_WINDOW = 100; // Maximum 100 requests per 15 minutes (reasonable)
const WINDOW_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_CONSECUTIVE_FAILURES = 5; // Open circuit breaker after 5 failures
const CIRCUIT_BREAKER_TIMEOUT = 2 * 60 * 1000; // 2 minutes circuit breaker timeout

// Cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache (longer for better performance)

// Process request queue with ultra-aggressive rate limiting and circuit breaker
const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const now = Date.now();
    
    // Check circuit breaker
    if (circuitBreakerOpen) {
      console.log('Circuit breaker is open, skipping all API requests');
      // Clear the queue
      requestQueue = [];
      break;
    }
    
    // Reset window if 15 minutes have passed
    if (now - windowStartTime > WINDOW_DURATION) {
      requestCount = 0;
      windowStartTime = now;
      consecutiveFailures = 0; // Reset failures on new window
    }
    
    // Check if we've exceeded our request limit
    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      const timeUntilReset = WINDOW_DURATION - (now - windowStartTime);
      console.log(`Global rate limit exceeded, waiting ${Math.ceil(timeUntilReset / 1000)}s until reset`);
      await new Promise(resolve => setTimeout(resolve, timeUntilReset));
      requestCount = 0;
      windowStartTime = Date.now();
      consecutiveFailures = 0;
    }
    
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Global rate limiting: waiting ${delay}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const request = requestQueue.shift();
    if (request) {
      lastRequestTime = Date.now();
      requestCount++;
      console.log(`Making API request ${requestCount}/${MAX_REQUESTS_PER_WINDOW} in current window`);
      
      try {
        await request();
        consecutiveFailures = 0; // Reset failures on success
      } catch (error) {
        console.error('Request in global queue failed:', error);
        consecutiveFailures++;
        
        // Open circuit breaker if too many consecutive failures
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.log('Opening circuit breaker due to consecutive failures');
          circuitBreakerOpen = true;
          
          // Set timeout to close circuit breaker
          if (circuitBreakerTimeout) {
            clearTimeout(circuitBreakerTimeout);
          }
          
          circuitBreakerTimeout = setTimeout(() => {
            circuitBreakerOpen = false;
            consecutiveFailures = 0;
            console.log('Circuit breaker closed, API calls resumed');
          }, CIRCUIT_BREAKER_TIMEOUT);
          
          // Clear the queue
          requestQueue = [];
          break;
        }
      }
    }
  }
  
  isProcessingQueue = false;
};

// Generate cache key for API request
const getCacheKey = (method, url, params = {}) => {
  const paramString = Object.keys(params).length > 0 ? JSON.stringify(params) : '';
  return `${method.toUpperCase()}:${url}:${paramString}`;
};

// Check if cached response is still valid
const isCacheValid = (cachedData) => {
  if (!cachedData) return false;
  return Date.now() - cachedData.timestamp < CACHE_DURATION;
};

// Global rate-limited API call function
export const rateLimitedApiCall = async (apiFunction, cacheKey = null, forceRefresh = false) => {
  // Check circuit breaker first
  if (circuitBreakerOpen) {
    console.log('Circuit breaker is open, returning cached data or rejecting request');
    
    // Try to return cached data if available
    if (cacheKey) {
      const cachedData = apiCache.get(cacheKey);
      if (isCacheValid(cachedData)) {
        console.log('Returning cached data due to circuit breaker');
        return cachedData.data;
      }
    }
    
    // If no cached data, reject the request
    return Promise.reject(new Error('Circuit breaker is open - API calls temporarily disabled'));
  }
  
  // Generate cache key if not provided
  if (!cacheKey) {
    cacheKey = `api_call_${Date.now()}_${Math.random()}`;
  }
  
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cachedData = apiCache.get(cacheKey);
    if (isCacheValid(cachedData)) {
      console.log('Using cached API response for:', cacheKey);
      return cachedData.data;
    }
  }
  
  // Add request to queue
  return new Promise((resolve, reject) => {
    const requestFunction = async () => {
      try {
        const response = await apiFunction();
        
        // Cache the response
        apiCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
        
        resolve(response);
      } catch (error) {
        reject(error);
      }
    };
    
    requestQueue.push(requestFunction);
    processRequestQueue();
  });
};

// Get rate limit status
export const getRateLimitStatus = () => {
  const now = Date.now();
  const timeSinceWindowStart = now - windowStartTime;
  const timeUntilReset = WINDOW_DURATION - timeSinceWindowStart;
  
  return {
    requestsUsed: requestCount,
    requestsRemaining: MAX_REQUESTS_PER_WINDOW - requestCount,
    timeUntilReset: Math.max(0, timeUntilReset),
    queueLength: requestQueue.length,
    isProcessing: isProcessingQueue,
    cacheSize: apiCache.size,
    circuitBreakerOpen: circuitBreakerOpen,
    consecutiveFailures: consecutiveFailures,
    maxConsecutiveFailures: MAX_CONSECUTIVE_FAILURES
  };
};

// Clear cache
export const clearApiCache = () => {
  apiCache.clear();
  console.log('API cache cleared');
};

// Reset rate limiter
export const resetRateLimiter = () => {
  requestQueue = [];
  isProcessingQueue = false;
  requestCount = 0;
  windowStartTime = Date.now();
  apiCache.clear();
  circuitBreakerOpen = false;
  consecutiveFailures = 0;
  
  if (circuitBreakerTimeout) {
    clearTimeout(circuitBreakerTimeout);
    circuitBreakerTimeout = null;
  }
  
  console.log('Rate limiter reset, circuit breaker closed, and cache cleared');
};

// Clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      apiCache.delete(key);
    }
  }
};

// Auto-cleanup expired cache every 5 minutes
setInterval(clearExpiredCache, 5 * 60 * 1000);
