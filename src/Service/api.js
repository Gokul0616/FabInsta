// api/axios.js
import axios from "axios";
import { backendUrl, storage } from "../Common/Common";
import { navigate } from "./Hook/navigationRef";

const api = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: ["application/json", "multipart/form-data"],
  },
});

api.interceptors.request.use(
  (config) => {
    const token = storage.getString("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      navigate("Logout");
    }

    return Promise.reject(error);
  }
);

export default api;
