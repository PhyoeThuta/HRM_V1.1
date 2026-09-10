import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Passthrough for request
api.interceptors.request.use((config) => {
  return config;
});

// Handle 401 — attempt silent refresh once, then redirect
let isRefreshing = false;
let failedQueue = [];
let hasRedirected = false; // Prevent redirect loop

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors, and skip if already retried or it's a 429
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip redirect/retry logic for auth endpoints themselves — avoids infinite loop
      const isAuthEndpoint = originalRequest.url?.includes('/auth/');
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        processQueue(null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        isRefreshing = false;

        // Only redirect once, and only if not already on login page
        if (!hasRedirected && window.location.pathname !== '/login') {
          hasRedirected = true;
          // Reset flag after navigation so future sessions work
          setTimeout(() => { hasRedirected = false; }, 3000);
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
