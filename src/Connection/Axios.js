import axios from "axios";
// import localStorage from "redux-persist/lib/storage";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",  // Adjust based on your backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // Required for cookies (refresh token)
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

// **Response Interceptor: Handle Token Expiry & Refresh**
axiosInstance.interceptors.response.use(
  (response) => response,  // Return successful response
  async (error) => {
    const originalRequest = error.config;

    // **If token expired (401), try refreshing**
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        localStorage.removeItem("accessToken");  // Clear invalid token
        window.location.href = "/login";  // Redirect to login if refresh fails
      }
    }

    return Promise.reject(error);  // If error is not token expiry, reject the error
  }
);

export default axiosInstance;
