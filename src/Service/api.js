import axios from "axios";
import { backendUrl, storage } from "../Common/Common";
import { CommonActions } from "@react-navigation/native"; // Import the CommonActions to reset navigation
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const api = axios.create({
  baseURL: backendUrl, // Replace with your common base URL
  timeout: 10000, // Optional: Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Default headers
    Accept: "application/json",
  },
});

// Optional: Add interceptors for requests and responses
api.interceptors.request.use(
  (config) => {
    // Modify request before sending it, e.g., add authentication tokens
    const token = storage.getString("token"); // Replace with actual token logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  async (error) => {
    // Handle response errors
    const { response } = error;

    if (response && response.status === 401) {
      // Unauthorized error, navigate to login screen
      const navigation = useNavigation();

      // Reset navigation stack and navigate to login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Signin" }],
        })
      );

      // Optionally, clear the stored token or perform other actions
      storage.remove("token");
    }

    return Promise.reject(error);
  }
);

export default api;
