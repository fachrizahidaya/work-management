import axios from "axios";
import * as SecureStore from "expo-secure-store";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const userToken = await SecureStore.getItemAsync("user_token");
    const slicedUserToken = userToken?.replace(`"`, "");
    const finalSlicedUserToken = slicedUserToken?.replace(`"`, "");
    if (finalSlicedUserToken) {
      config.headers.authorization = `Bearer ${finalSlicedUserToken}` || "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const userData = await SecureStore.getItemAsync("user_data");
    const method = error.response.request._method;

    if (error.response.status == 402) {
      const res = await axiosInstance.post("/auth/login", {
        email: userData.email,
        password: userData.password_real,
      });
      const newToken = res.data.data.access_token;
      await SecureStore.setItemAsync("user_token", newToken);

      // Redo the request here:
      if (method === "GET") {
        return axiosInstance.get(error.config.url);
      } else if (method === "POST") {
        const requestData = JSON.parse(error.config.data);
        return axiosInstance.post(error.config.url, requestData);
      } else if (method === "PATCH") {
        const requestData = JSON.parse(error.config.data);
        return axiosInstance.patch(error.config.url, requestData);
      } else if (method === "DELETE") {
        return axiosInstance.delete(error.config.url);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
