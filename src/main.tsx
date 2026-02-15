import {createRoot} from "react-dom/client";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {App} from "./app.tsx";
import {ErrorBoundary} from "./components/ErrorBoundary.tsx";
import {registerServiceWorker, sendConfigToServiceWorker} from "./utils/serviceWorkerHelper";
import {valuationData} from "./valuation";
import "./index.css";

// Register service worker on app load
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        const registration = await registerServiceWorker();
        if (registration) {
            console.log("Service Worker 準備就緒");

            // Send initial config if notifications are enabled
            const notificationsEnabled = localStorage.getItem("stock-valuation-notifications-enabled") === "true";
            const apiUrl = import.meta.env.VITE_QUOTES_API_URL;

            if (notificationsEnabled && apiUrl) {
                const notifiedStocksStr = localStorage.getItem("stock-valuation-notified-stocks");
                const notifiedStocks = notifiedStocksStr ? JSON.parse(notifiedStocksStr) : [];

                // Wait a bit for the service worker to be ready
                setTimeout(() => {
                    sendConfigToServiceWorker({
                        apiUrl,
                        valuationData: valuationData.stocks,
                        notifiedStocks,
                    });
                }, 1000);
            }
        }
    });

    // Listen for service worker messages and update the store
    window.addEventListener("sw-stock-netnet", ((event: CustomEvent) => {
        console.log("收到 SW 通知: 股票達到殘值", event.detail);
        // Store will be updated via the custom event
        const notifiedStocks = event.detail.notifiedStocks;
        if (notifiedStocks) {
            localStorage.setItem("stock-valuation-notified-stocks", JSON.stringify(notifiedStocks));
        }
    }) as EventListener);

    window.addEventListener("sw-stock-recovered", ((event: CustomEvent) => {
        console.log("收到 SW 通知: 股票已恢復", event.detail);
        const notifiedStocks = event.detail.notifiedStocks;
        if (notifiedStocks) {
            localStorage.setItem("stock-valuation-notified-stocks", JSON.stringify(notifiedStocks));
        }
    }) as EventListener);
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </ErrorBoundary>
);
