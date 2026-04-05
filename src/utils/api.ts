import axios, {AxiosError} from "axios";

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

        // Retry logic for network errors or 5xx errors
        if (config && !config.headers?.["x-retry-count"]) {
            const retryCount = 0;
            const maxRetries = 2;

            if (retryCount < maxRetries && (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || (error.response && error.response.status >= 500))) {
                config.headers = config.headers || {};
                config.headers["x-retry-count"] = String(retryCount + 1);

                // Exponential backoff: 1s, 2s
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));

                return api(config);
            }
        }

        return Promise.reject(error);
    }
);
