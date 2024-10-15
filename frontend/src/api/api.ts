import axios from "axios";
import { trimQuotes } from "../helpers/trim-quotes";

export const authApi = axios.create({
  baseURL: "http://localhost:8001",
});

export const api = axios.create({
  baseURL: "http://localhost:8001",
});

authApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${trimQuotes(token)}`;
    } else {
      config.headers["Authorization"] = "";
      return Promise.reject(new Error("No token found"));
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
