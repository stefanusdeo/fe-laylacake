import { environment } from "@/constant/endpoint";
import { useAuthStore } from "@/store/hooks/useAuth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { endpoint } from "@/constant/endpoint";
import Cookie from "js-cookie";

const baseURL = environment.baseUrl;
const { accessToken, refreshToken } = useAuthStore.getState();

export const API = axios.create({
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  },
  baseURL,
  withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenValue = useAuthStore.getState().refreshToken;
        
        if (!refreshTokenValue) {
          // No refresh token available, logout
          useAuthStore.getState().logout();
          Cookie.remove("access_token");
          processQueue(new Error("No refresh token available"));
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${baseURL}${endpoint.auth.refreshToken}`,
          { refresh_token: refreshTokenValue },
          { withCredentials: true }
        );

        const { access_token, refresh_token } = response.data.data;
        
        // Update tokens
        Cookie.set("access_token", access_token);
        useAuthStore.getState().setAuth(access_token, refresh_token);
        
        // Update headers for future requests
        API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Process any queued requests
        processQueue(null, access_token);
        
        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        useAuthStore.getState().logout();
        Cookie.remove("access_token");
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
