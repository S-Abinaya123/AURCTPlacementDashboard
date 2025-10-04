import axios from "axios";
import type { InternalAxiosRequestConfig } from 'axios';

const authAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

authAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("Token");

        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authAxios;
