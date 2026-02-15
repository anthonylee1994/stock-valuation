import {create} from "zustand";
import type {StockWithQuote, Quote, ValuationData} from "../types";
import {valuationData} from "../valuation";
import moment from "moment";

// LocalStorage keys
const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";

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
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setPulse: (pulse: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setError: (error: string | null) => void;
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: "hk" | "us") => void;
    fetchQuotes: (symbols: string, stocksData: ValuationData["stocks"]) => Promise<void>;
    startPolling: (symbols: string, stocksData: ValuationData["stocks"]) => () => void;
    retryFetch: () => void;
}

const mergeStocksWithQuotes = (stocks: ValuationData["stocks"], quotes: Quote[]): StockWithQuote[] => {
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
    return stocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) return null;
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
    sortOrder: (() => {
        const saved = localStorage.getItem(SORT_ORDER_KEY);
        return saved === "asc" || saved === "desc" ? saved : "asc";
    })(),
    marketFilter: (() => {
        const saved = localStorage.getItem(MARKET_FILTER_KEY);
        return saved === "hk" || saved === "us" ? saved : "us";
    })(),

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setPulse: pulse => set({pulse}),
    setLastUpdate: lastUpdate => set({lastUpdate}),
    setError: error => set({error}),

    setSortOrder: sortOrder => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
        set({sortOrder});
    },

    setMarketFilter: marketFilter => {
        localStorage.setItem(MARKET_FILTER_KEY, marketFilter);
        set({marketFilter});
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
        const symbols = valuationData.stocks.map(s => s.symbol).join(",");
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
