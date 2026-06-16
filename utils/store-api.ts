import axios, {AxiosInstance, RawAxiosRequestHeaders} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/';

// Cookie helper
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Set cookie helper
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Cookie key for current store
const CURRENT_STORE_COOKIE = 'currentStoreId';

/**
 * Get the current store ID from cookie.
 */
export function getCurrentStoreId(): string | null {
  return getCookie(CURRENT_STORE_COOKIE);
}

/**
 * Set the current store ID in cookie.
 */
export function setCurrentStoreId(storeId: string): void {
  setCookie(CURRENT_STORE_COOKIE, storeId, 30);
}

/**
 * Create an axios instance with store context headers.
 * This instance automatically includes X-Store-Id header in all requests.
 */
export function createStoreApiInstance(storeId?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Request interceptor to add store ID header
  instance.interceptors.request.use(
    (config) => {
      const currentStoreId = storeId || getCurrentStoreId();
      if (currentStoreId) {
        config.headers = config.headers || {};
        (config.headers as RawAxiosRequestHeaders)['X-Store-Id'] = currentStoreId;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log store-related errors
      if (error.response?.status === 403) {
        console.error('[Store API] Access denied - check store permissions');
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Default store-aware API instance
export const storeApi = createStoreApiInstance();

/**
 * Utility to make store-aware API calls.
 */
export const StoreAPI = {
  get: async <T = any>(url: string, storeId?: string): Promise<T> => {
    const api = storeId ? createStoreApiInstance(storeId) : storeApi;
    const response = await api.get(url);
    return response.data?.payload ?? response.data;
  },

  post: async <T = any>(url: string, data?: any, storeId?: string): Promise<T> => {
    const api = storeId ? createStoreApiInstance(storeId) : storeApi;
    const response = await api.post(url, data);
    return response.data?.payload ?? response.data;
  },

  put: async <T = any>(url: string, data?: any, storeId?: string): Promise<T> => {
    const api = storeId ? createStoreApiInstance(storeId) : storeApi;
    const response = await api.put(url, data);
    return response.data?.payload ?? response.data;
  },

  delete: async <T = any>(url: string, storeId?: string): Promise<T> => {
    const api = storeId ? createStoreApiInstance(storeId) : storeApi;
    const response = await api.delete(url);
    return response.data?.payload ?? response.data;
  }
};

export default StoreAPI;
