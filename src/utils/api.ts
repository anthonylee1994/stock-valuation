import axios, {AxiosError} from "axios";

const MAX_RETRIES = 2;

type RetryableConfig = {
    __retryCount?: number;
};

// Validate environment variables
const API_URL = import.meta.env.VITE_QUOTES_API_URL;
if (!API_URL) {
    throw new Error("VITE_QUOTES_API_URL environment variable is not defined");
}

export const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor with retry logic
api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const config = error.config;

        if (!config) {
            return Promise.reject(error);
        }

        const retryConfig = config as typeof config & RetryableConfig;
        const retryCount = retryConfig.__retryCount ?? 0;
        const shouldRetry = error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || (error.response ? error.response.status >= 500 : false);

        // Retry network and 5xx failures with exponential backoff: 1s, 2s
        if (shouldRetry && retryCount < MAX_RETRIES) {
            retryConfig.__retryCount = retryCount + 1;

            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));

            return api(retryConfig);
        }

        return Promise.reject(error);
    }
);
