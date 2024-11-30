import axios from "axios";
import { getSession } from "next-auth/react";
import { ResponseErrorAxios } from "./ResponseErrorAxios";

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "cache-control": "no-cache",
  Expire: 0,
};
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  timeout: 60 * 1000,
});

let accessToken: string | null = null;

instance.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      const session = await getSession();
      accessToken = session?.user?.accessToken || null;
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    ResponseErrorAxios(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
