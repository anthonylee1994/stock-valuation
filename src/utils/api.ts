const MAX_RETRIES = 2;
const REQUEST_TIMEOUT = 15_000;

// Validate environment variables
const API_URL = import.meta.env.VITE_QUOTES_API_URL;
if (!API_URL) {
    throw new Error("VITE_QUOTES_API_URL environment variable is not defined");
}

function wait(delay: number, signal?: AbortSignal) {
    return new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            signal?.removeEventListener("abort", handleAbort);
            resolve();
        }, delay);
        const handleAbort = () => {
            window.clearTimeout(timeout);
            reject(signal?.reason ?? new DOMException("Request aborted", "AbortError"));
        };

        signal?.addEventListener("abort", handleAbort, {once: true});
    });
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const url = `${API_URL.replace(/\/$/, "")}${path}`;

    for (let attempt = 0; ; attempt += 1) {
        const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT);
        const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

        try {
            const response = await fetch(url, {signal: requestSignal});

            if (!response.ok) {
                const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
                if (response.status < 500) {
                    throw Object.assign(error, {retryable: false});
                }
                throw error;
            }

            return (await response.json()) as T;
        } catch (error) {
            const retryable = !(error instanceof Error && "retryable" in error && error.retryable === false);
            if (signal?.aborted || !retryable || attempt >= MAX_RETRIES) {
                throw error;
            }

            await wait(2 ** attempt * 1000, signal);
        }
    }
}
