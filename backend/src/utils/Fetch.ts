import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import type { IFetch } from "../types/index.js";

class Fetch implements IFetch {
    private instance: AxiosInstance;

    handleSuccess(res: AxiosResponse) {
        return res;
    }

    handleError(error: AxiosError) {
        const requestDetails = error.config
            ? {
                  url: error.config.url,
                  method: error.config.method,
                  headers: error.config.headers,
                  data: error.config.data,
              }
            : null;

        console.error("AxiosError: ", {
            error: error.message,
            response: error.response ? error.response.data : null,
            request: requestDetails,
        });

        return Promise.reject(error);
    }

    constructor() {
        const instance = axios.create({
            headers: {
                Accept: "application/json",
            },
            withCredentials: true,
        });

        instance.interceptors.response.use(this.handleSuccess.bind(this), this.handleError.bind(this));

        this.instance = instance;
    }

    async get<T = never, R = AxiosResponse<T>>(url: string, options?: AxiosRequestConfig<T>) {
        const res = await this.instance.get<T, R>(url, { ...options });
        return res;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    async post<T = never, R = AxiosResponse<T>, D = unknown>(url: string, data: D, options?: AxiosRequestConfig<T>) {
        const res = await this.instance.post<T, R>(url, data, { ...options });
        return res;
    }

    async put<T = never, R = AxiosResponse<T>, D = unknown>(url: string, data: D, options?: AxiosRequestConfig) {
        const res = await this.instance.put<T, R>(url, data, { ...options });
        return res;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    async delete<T = never, R = AxiosResponse<T>>(url: string, options?: AxiosRequestConfig<T>) {
        const res = await this.instance.delete<T, R>(url, { ...options });
        return res;
    }
}

export const fetch = new Fetch();
export default Fetch;
