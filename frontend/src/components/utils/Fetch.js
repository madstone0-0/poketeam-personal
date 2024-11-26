import axios from "axios";
import { API_BASE } from "../constants";

/**
 * Fetch class for making HTTP requests using Axios.
 */
class Fetch {
    /**
     * Axios instance for making requests.
     * @type {import("axios").AxiosInstance}
     */
    instance;

    /**
     * Handles successful responses.
     * @param {import("axios").AxiosResponse} res - Axios response.
     * @returns {import("axios").AxiosResponse} - The response object.
     */
    handleSuccess(res) {
        return res;
    }

    /**
     * Handles errors during requests.
     * @param {import("axios").AxiosError} error - Axios error object.
     * @returns {Promise<never>} - A rejected promise with the error.
     */
    handleError(error) {
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
            baseURL: API_BASE,
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        instance.interceptors.response.use(this.handleSuccess.bind(this), this.handleError.bind(this));

        this.instance = instance;
    }

    /**
     * Makes a GET request.
     * @template T
     * @template R
     * @param {string} url - The request URL.
     * @param {import("axios").AxiosRequestConfig<T>} [options] - Axios request options.
     * @returns {Promise<R>} - The response promise.
     */
    async get(url, options) {
        const res = await this.instance.get(url, { ...options });
        res.data = res.data.data;
        return res;
    }

    /**
     * Makes a POST request.
     * @template T
     * @template R
     * @param {string} url - The request URL.
     * @param {*} data - The data to send in the request body.
     * @param {import("axios").AxiosRequestConfig<T>} [options] - Axios request options.
     * @returns {Promise<R>} - The response promise.
     */
    async post(url, data, options) {
        const res = await this.instance.post(url, data, { ...options });
        res.data = res.data.data;
        return res;
    }

    /**
     * Makes a PUT request.
     * @template T
     * @template R
     * @param {string} url - The request URL.
     * @param {*} data - The data to send in the request body.
     * @param {import("axios").AxiosRequestConfig<T>} [options] - Axios request options.
     * @returns {Promise<R>} - The response promise.
     */
    async put(url, data, options) {
        const res = await this.instance.put(url, data, { ...options });
        res.data = res.data.data;
        return res;
    }

    /**
     * Makes a DELETE request.
     * @template T
     * @template R
     * @param {string} url - The request URL.
     * @param {import("axios").AxiosRequestConfig<T>} [options] - Axios request options.
     * @returns {Promise<R>} - The response promise.
     */
    async delete(url, options) {
        const res = await this.instance.delete(url, { ...options });
        res.data = res.data.data;
        return res;
    }
}

export const fetch = new Fetch();
export default Fetch;
