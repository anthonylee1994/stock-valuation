/**
 * Service Worker registration and communication helper
 */

export interface ServiceWorkerConfig {
    apiUrl: string;
    valuationData: Array<{
        symbol: string;
        name: string;
        market: "US" | "HK";
        valuationLow: number;
        valuationHigh: number;
    }>;
    notifiedStocks: string[];
}

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service Worker 不支援此瀏覽器");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
        });
        
        serviceWorkerRegistration = registration;
        console.log("Service Worker 註冊成功:", registration.scope);

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);

        // Try to request periodic sync (if supported)
        await requestPeriodicSync(registration);

        return registration;
    } catch (error) {
        console.error("Service Worker 註冊失敗:", error);
        return null;
    }
};

/**
 * Request periodic background sync (if supported by browser)
 */
const requestPeriodicSync = async (registration: ServiceWorkerRegistration) => {
    if ("periodicSync" in registration) {
        try {
            // @ts-ignore - periodicSync is experimental
            await registration.periodicSync.register("check-stock-prices", {
                minInterval: 60 * 1000, // 60 seconds
            });
            console.log("Periodic sync 註冊成功");
        } catch (error) {
            console.warn("Periodic sync 不支援或被拒絕:", error);
        }
    } else {
        console.log("此瀏覽器不支援 Periodic Background Sync");
    }
};

/**
 * Send configuration to service worker
 */
export const sendConfigToServiceWorker = (config: ServiceWorkerConfig) => {
    if (!navigator.serviceWorker.controller) {
        console.warn("Service Worker 控制器不可用");
        return;
    }

    navigator.serviceWorker.controller.postMessage({
        type: "INIT_CONFIG",
        apiUrl: config.apiUrl,
        valuationData: config.valuationData,
        notifiedStocks: config.notifiedStocks,
    });

    console.log("配置已發送到 Service Worker");
};

/**
 * Update notified stocks list in service worker
 */
export const updateNotifiedStocksInServiceWorker = (notifiedStocks: string[]) => {
    if (!navigator.serviceWorker.controller) {
        return;
    }

    navigator.serviceWorker.controller.postMessage({
        type: "UPDATE_NOTIFIED_STOCKS",
        notifiedStocks,
    });
};

/**
 * Disable notifications in service worker
 */
export const disableNotificationsInServiceWorker = () => {
    if (!navigator.serviceWorker.controller) {
        return;
    }

    navigator.serviceWorker.controller.postMessage({
        type: "DISABLE_NOTIFICATIONS",
    });
};

/**
 * Handle messages from service worker
 */
const handleServiceWorkerMessage = (event: MessageEvent) => {
    const {type, symbol, notifiedStocks} = event.data;

    switch (type) {
        case "STOCK_REACHED_NETNET":
            console.log(`Service Worker 通知: ${symbol} 達到殘值`);
            // Dispatch custom event that the app can listen to
            window.dispatchEvent(
                new CustomEvent("sw-stock-netnet", {
                    detail: {symbol, notifiedStocks},
                })
            );
            break;
        case "STOCK_RECOVERED":
            console.log(`Service Worker 通知: ${symbol} 已恢復`);
            window.dispatchEvent(
                new CustomEvent("sw-stock-recovered", {
                    detail: {symbol, notifiedStocks},
                })
            );
            break;
        default:
            break;
    }
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async () => {
    if (!serviceWorkerRegistration) {
        return;
    }

    try {
        await serviceWorkerRegistration.unregister();
        console.log("Service Worker 已註銷");
        serviceWorkerRegistration = null;
    } catch (error) {
        console.error("Service Worker 註銷失敗:", error);
    }
};

/**
 * Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
    return "serviceWorker" in navigator;
};
