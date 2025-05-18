import axios from "axios";
import store from "../Store/store"; 
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip if already retried or not a 401 error
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    originalRequest._retry = true;

    // Handle specific error cases
    const errorCode = error.response.data?.code;
    
    // Don't try to refresh token if the error is about admin access
    if (errorCode === "ADMIN_REQUIRED") {
      store.dispatch(logout());
      return Promise.reject(error);
    }
    
    // Don't try to refresh if the token is invalid (not just expired)
    if (errorCode === "INVALID_TOKEN") {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh token
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/refresh-token`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
      // Clear all auth data and logout
      localStorage.removeItem("accessToken");
      store.dispatch(removeUser());
      store.dispatch(logout());
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;