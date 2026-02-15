/**
 * Notification helper for browser push notifications
 */

export interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
}

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
        console.warn("此瀏覽器不支援桌面通知");
        return "denied";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
};

/**
 * Show a browser notification
 */
export const showNotification = (options: NotificationOptions): void => {
    if (!("Notification" in window)) {
        console.warn("此瀏覽器不支援桌面通知");
        return;
    }

    if (Notification.permission === "granted") {
        const notification = new Notification(options.title, {
            body: options.body,
            icon: options.icon || "/favicon.ico",
            tag: options.tag,
            requireInteraction: options.requireInteraction || false,
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10000);
    } else if (Notification.permission !== "denied") {
        requestNotificationPermission().then(permission => {
            if (permission === "granted") {
                showNotification(options);
            }
        });
    }
};

/**
 * Check if a stock has reached its net net value (valuationLow)
 */
export const isAtNetNetValue = (currentPrice: number, valuationLow: number): boolean => {
    return currentPrice <= valuationLow;
};

/**
 * Format currency based on market
 */
export const formatCurrency = (price: number, market: "US" | "HK"): string => {
    if (market === "HK") {
        return `HK$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
};
