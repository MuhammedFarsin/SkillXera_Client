import axios from "axios";
import store from "../Store/store"; 
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true, 
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const response = await axiosInstance.post("/refresh-token", {}, { withCredentials: true });
        const { accessToken } = response.data;
        console.log("New access token received:", accessToken);

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        localStorage.removeItem("accessToken");
        store.dispatch(removeUser());
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
