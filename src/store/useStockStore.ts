import {create} from "zustand";
import type {StockWithQuote, Quote, ValuationData} from "../types";
import {valuationData} from "../valuation";
import {validateAndDeduplicateStocks, getUniqueSymbols} from "../utils/stockHelpers";
import {showNotification, isAtNetNetValue, formatCurrency, requestNotificationPermission} from "../utils/notificationHelper";
import {sendConfigToServiceWorker, updateNotifiedStocksInServiceWorker, disableNotificationsInServiceWorker} from "../utils/serviceWorkerHelper";
import moment from "moment";

// LocalStorage keys
const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";
const NOTIFICATIONS_ENABLED_KEY = "stock-valuation-notifications-enabled";
const NOTIFIED_STOCKS_KEY = "stock-valuation-notified-stocks";

// Timing constants
const PULSE_DURATION = 1500; // ms - duration of pulse animation
const POLLING_INTERVAL = 10_000; // ms - interval between API calls (10 seconds)

interface StockStore {
    stocks: StockWithQuote[];
    loading: boolean;
    pulse: boolean;
    lastUpdate: string | null;
    error: string | null;
    sortOrder: "asc" | "desc";
    marketFilter: "hk" | "us";
    cardsFlipped: boolean;
    notificationsEnabled: boolean;
    notifiedStocks: Set<string>;
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setPulse: (pulse: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setError: (error: string | null) => void;
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: "hk" | "us") => void;
    toggleCardsFlip: () => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    requestNotificationPermission: () => Promise<void>;
    checkAndNotifyNetNetStocks: (stocks: StockWithQuote[]) => void;
    resetNotifiedStocks: () => void;
    fetchQuotes: (symbols: string, stocksData: ValuationData["stocks"]) => Promise<void>;
    startPolling: (symbols: string, stocksData: ValuationData["stocks"]) => () => void;
    retryFetch: () => void;
}

const mergeStocksWithQuotes = (stocks: ValuationData["stocks"], quotes: Quote[]): StockWithQuote[] => {
    // Build quote map, warn if quotes have duplicates
    const quoteMap = new Map<string, Quote>();
    const quoteDuplicates: string[] = [];

    quotes.forEach(quote => {
        if (quoteMap.has(quote.symbol)) {
            quoteDuplicates.push(quote.symbol);
            console.warn(`Duplicate quote received for symbol: "${quote.symbol}". Using latest.`);
        }
        quoteMap.set(quote.symbol, quote);
    });

    if (quoteDuplicates.length > 0) {
        console.warn(`API returned ${quoteDuplicates.length} duplicate quote(s): ${[...new Set(quoteDuplicates)].join(", ")}`);
    }

    // Deduplicate stocks before merging
    const dedupedStocks = validateAndDeduplicateStocks(stocks);

    // Merge stocks with quotes
    return dedupedStocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) {
                console.warn(`No quote found for symbol: "${stock.symbol}"`);
                return null;
            }
            return {
                ...stock,
                ...quote,
            };
        })
        .filter((s): s is StockWithQuote => s !== null);
};

export const useStockStore = create<StockStore>((set, get) => ({
    stocks: [],
    loading: true,
    pulse: false,
    lastUpdate: null,
    error: null,
    cardsFlipped: false,
    sortOrder: (() => {
        const saved = localStorage.getItem(SORT_ORDER_KEY);
        return saved === "asc" || saved === "desc" ? saved : "asc";
    })(),
    marketFilter: (() => {
        const saved = localStorage.getItem(MARKET_FILTER_KEY);
        return saved === "hk" || saved === "us" ? saved : "us";
    })(),
    notificationsEnabled: (() => {
        const saved = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
        return saved === "true";
    })(),
    notifiedStocks: (() => {
        const saved = localStorage.getItem(NOTIFIED_STOCKS_KEY);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    })(),

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setPulse: pulse => set({pulse}),
    setLastUpdate: lastUpdate => set({lastUpdate}),
    setError: error => set({error}),
    toggleCardsFlip: () => set(state => ({cardsFlipped: !state.cardsFlipped})),

    setSortOrder: sortOrder => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
        set({sortOrder});
    },

    setMarketFilter: marketFilter => {
        localStorage.setItem(MARKET_FILTER_KEY, marketFilter);
        set({marketFilter});
    },

    setNotificationsEnabled: enabled => {
        localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
        set({notificationsEnabled: enabled});
        if (!enabled) {
            // Clear notified stocks when disabling notifications
            localStorage.removeItem(NOTIFIED_STOCKS_KEY);
            set({notifiedStocks: new Set()});
            disableNotificationsInServiceWorker();
        } else {
            // Send config to service worker when enabling
            const apiUrl = import.meta.env.VITE_QUOTES_API_URL;
            if (apiUrl) {
                sendConfigToServiceWorker({
                    apiUrl,
                    valuationData: valuationData.stocks,
                    notifiedStocks: Array.from(get().notifiedStocks),
                });
            }
        }
    },

    requestNotificationPermission: async () => {
        const permission = await requestNotificationPermission();
        if (permission === "granted") {
            get().setNotificationsEnabled(true);
            
            // Send initial config to service worker
            const apiUrl = import.meta.env.VITE_QUOTES_API_URL;
            if (apiUrl) {
                sendConfigToServiceWorker({
                    apiUrl,
                    valuationData: valuationData.stocks,
                    notifiedStocks: Array.from(get().notifiedStocks),
                });
            }
        } else {
            get().setNotificationsEnabled(false);
        }
    },

    checkAndNotifyNetNetStocks: stocks => {
        const {notificationsEnabled, notifiedStocks} = get();

        if (!notificationsEnabled) return;

        const newNotifiedStocks = new Set(notifiedStocks);
        let hasNewNotifications = false;

        stocks.forEach(stock => {
            if (isAtNetNetValue(stock.currentPrice, stock.valuationLow) && !notifiedStocks.has(stock.symbol)) {
                // Stock has reached net net value and hasn't been notified yet
                showNotification({
                    title: `💎 ${stock.name} (${stock.symbol}) 已達殘值！`,
                    body: `當前價格 ${formatCurrency(stock.currentPrice, stock.market)} 已跌至殘值 ${formatCurrency(stock.valuationLow, stock.market)}`,
                    tag: `netnet-${stock.symbol}`,
                    requireInteraction: true,
                });

                newNotifiedStocks.add(stock.symbol);
                hasNewNotifications = true;
            } else if (!isAtNetNetValue(stock.currentPrice, stock.valuationLow) && notifiedStocks.has(stock.symbol)) {
                // Stock has recovered above net net value, remove from notified list
                newNotifiedStocks.delete(stock.symbol);
                hasNewNotifications = true;
            }
        });

        if (hasNewNotifications) {
            localStorage.setItem(NOTIFIED_STOCKS_KEY, JSON.stringify(Array.from(newNotifiedStocks)));
            set({notifiedStocks: newNotifiedStocks});
            
            // Update service worker with new notified stocks
            updateNotifiedStocksInServiceWorker(Array.from(newNotifiedStocks));
        }
    },

    resetNotifiedStocks: () => {
        localStorage.removeItem(NOTIFIED_STOCKS_KEY);
        set({notifiedStocks: new Set()});
        updateNotifiedStocksInServiceWorker([]);
    },

    fetchQuotes: async (symbols, stocksData) => {
        const currentStocks = get().stocks;
        set({loading: true, error: null});
        try {
            const apiUrl = import.meta.env.VITE_QUOTES_API_URL;

            if (!apiUrl) {
                throw new Error("API URL 未設定。請檢查環境變量 VITE_QUOTES_API_URL。");
            }

            const res = await fetch(`${apiUrl}?symbols=${encodeURIComponent(symbols)}`);

            if (!res.ok) {
                throw new Error(`API 請求失敗：${res.status} ${res.statusText}`);
            }

            const json = (await res.json()) as {quotes: Quote[]};

            if (!json.quotes || json.quotes.length === 0) {
                throw new Error("API 返回空數據。請稍後再試。");
            }

            const merged = mergeStocksWithQuotes(stocksData, json.quotes);
            set({
                stocks: merged,
                lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
                pulse: true,
                loading: false,
                error: null,
            });

            // Check and notify for stocks at net net value
            get().checkAndNotifyNetNetStocks(merged);

            setTimeout(() => {
                set({pulse: false});
            }, PULSE_DURATION);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "無法載入股票數據。請檢查網絡連接。";
            console.error("fetchQuotes error:", e);

            // Keep existing stocks if this is a refresh, only set error
            set({
                error: errorMessage,
                loading: false,
                stocks: currentStocks.length > 0 ? currentStocks : [],
            });
        }
    },

    retryFetch: () => {
        const {fetchQuotes} = get();
        const symbols = getUniqueSymbols(valuationData.stocks);
        fetchQuotes(symbols, valuationData.stocks);
    },

    startPolling: (symbols, stocksData) => {
        const {fetchQuotes} = get();

        fetchQuotes(symbols, stocksData);

        const interval = setInterval(() => {
            if (!document.hidden) {
                fetchQuotes(symbols, stocksData);
            }
        }, POLLING_INTERVAL);

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchQuotes(symbols, stocksData);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    },
}));
