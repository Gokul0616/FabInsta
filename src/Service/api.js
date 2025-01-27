import axios from "axios";
import { backendUrl, storage } from "../Common/Common";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const api = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = storage.getString("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      const navigation = useNavigation();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Signin" }],
        })
      );

      storage.remove("token");
    }

    return Promise.reject(error);
  }
);

export default api;
