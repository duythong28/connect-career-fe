import axios from "axios";

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value};path=/;secure;samesite=strict`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshToken");

      if (refreshToken) {
        try {
          // Use a separate axios instance to avoid infinite loops
          const refreshResponse = await axios
            .create({
              baseURL:
                import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/",
            })
            .post("/auth/refresh-token", { refreshToken });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          // Store new tokens without expiration times
          setCookie("accessToken", newAccessToken);
          setCookie("refreshToken", newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Export cookie utilities for use in components
export { getCookie, setCookie, deleteCookie };
export default axiosInstance;
