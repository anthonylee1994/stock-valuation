/* eslint-disable no-undef */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js");
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = "stock-valuation-v1";
const CHECK_INTERVAL = 60000; // Check every 60 seconds in background

// Store valuation data and API URL
let apiUrl = null;
let valuationData = [];
let notifiedStocks = new Set();

// Listen for messages from the main app
self.addEventListener("message", event => {
    if (event.data.type === "INIT_CONFIG") {
        apiUrl = event.data.apiUrl;
        valuationData = event.data.valuationData;
        notifiedStocks = new Set(event.data.notifiedStocks || []);
        console.log("[SW] Config initialized:", {apiUrl, stockCount: valuationData.length});
    } else if (event.data.type === "UPDATE_NOTIFIED_STOCKS") {
        notifiedStocks = new Set(event.data.notifiedStocks || []);
        console.log("[SW] Updated notified stocks:", Array.from(notifiedStocks));
    } else if (event.data.type === "DISABLE_NOTIFICATIONS") {
        notifiedStocks.clear();
        console.log("[SW] Notifications disabled, cleared notified stocks");
    }
});

// Periodic background sync to check stock prices
self.addEventListener("periodicsync", event => {
    if (event.tag === "check-stock-prices") {
        console.log("[SW] Periodic sync triggered");
        event.waitUntil(checkStockPrices());
    }
});

// Fallback: Use the service worker's activate event to start monitoring
self.addEventListener("activate", event => {
    console.log("[SW] Service Worker activated");
    event.waitUntil(
        clients.claim().then(() => {
            // Start periodic checks
            startPeriodicCheck();
        })
    );
});

// Function to check stock prices
async function checkStockPrices() {
    if (!apiUrl || valuationData.length === 0) {
        console.log("[SW] Cannot check prices: missing config");
        return;
    }

    try {
        const symbols = valuationData.map(s => s.symbol).join(",");
        const response = await fetch(`${apiUrl}?symbols=${encodeURIComponent(symbols)}`);

        if (!response.ok) {
            console.error("[SW] API request failed:", response.status);
            return;
        }

        const data = await response.json();
        const quotes = data.quotes || [];

        // Check each quote against valuation data
        for (const quote of quotes) {
            const stock = valuationData.find(s => s.symbol === quote.symbol);
            if (!stock) continue;

            const isAtNetNet = quote.currentPrice <= stock.valuationLow;
            const wasNotified = notifiedStocks.has(stock.symbol);

            // Send notification if reached net net value and not already notified
            if (isAtNetNet && !wasNotified) {
                await sendNotification(stock, quote);
                notifiedStocks.add(stock.symbol);

                // Notify all clients to update their notified stocks
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: "STOCK_REACHED_NETNET",
                        symbol: stock.symbol,
                        notifiedStocks: Array.from(notifiedStocks),
                    });
                });
            } else if (!isAtNetNet && wasNotified) {
                // Stock recovered above net net, remove from notified list
                notifiedStocks.delete(stock.symbol);

                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: "STOCK_RECOVERED",
                        symbol: stock.symbol,
                        notifiedStocks: Array.from(notifiedStocks),
                    });
                });
            }
        }
    } catch (error) {
        console.error("[SW] Error checking stock prices:", error);
    }
}

// Function to send notification
async function sendNotification(stock, quote) {
    const currencySymbol = stock.market === "HK" ? "HK$" : "$";
    const title = `💎 ${stock.name} (${stock.symbol}) 已達殘值！`;
    const body = `當前價格 ${currencySymbol}${quote.currentPrice.toFixed(2)} 已跌至殘值 ${currencySymbol}${stock.valuationLow.toFixed(2)}`;

    try {
        await self.registration.showNotification(title, {
            body: body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: `netnet-${stock.symbol}`,
            requireInteraction: true,
            data: {
                symbol: stock.symbol,
                url: "/",
            },
        });
        console.log("[SW] Notification sent for", stock.symbol);
    } catch (error) {
        console.error("[SW] Error sending notification:", error);
    }
}

// Handle notification clicks
self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({type: "window", includeUncontrolled: true}).then(clientList => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url === self.registration.scope && "focus" in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});

// Simple periodic check using setTimeout (fallback for browsers without periodic sync)
function startPeriodicCheck() {
    setInterval(() => {
        checkStockPrices();
    }, CHECK_INTERVAL);
}

// Cache static assets
self.addEventListener("install", event => {
    console.log("[SW] Service Worker installing");
    self.skipWaiting();
});

self.addEventListener("fetch", event => {
    // Let the browser handle all fetch requests normally
    // We're only using SW for background notifications
    event.respondWith(fetch(event.request));
});
