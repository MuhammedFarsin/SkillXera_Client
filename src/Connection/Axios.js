import axios from "axios";
import store from "../Store/store";  // Import the Redux store directly
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",  // Adjust based on your backend
  withCredentials: true,  // Required for cookies (refresh token)
});

// Request interceptor: Add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("Access token before request:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,  // Return successful response
  async (error) => {
    const originalRequest = error.config;

    // **If token expired (401), try refreshing**
    if (error.response?.status === 401 && !originalRequest._retry) {
      store.dispatch(logout())
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/refresh-token", {}, { withCredentials: true });
        const { accessToken } = response.data;  // Get new access token
        console.log("New access token received:", accessToken);

        // Store new access token
        localStorage.setItem("accessToken", accessToken);

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        
        // Remove invalid token and log out user
        localStorage.removeItem("accessToken");  
        store.dispatch(removeUser());  // ✅ Use store.dispatch()
        store.dispatch(logout());  // ✅ Use store.dispatch()
      }
    }

    return Promise.reject(error);  // If error is not token expiry, reject the error
  }
);

export default axiosInstance;
