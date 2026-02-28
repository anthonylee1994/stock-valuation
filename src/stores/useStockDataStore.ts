import type {Quote, StockWithQuote, ValuationData} from "@/types";
import {api} from "@/utils/api";
import {getUniqueSymbols, validateAndDeduplicateStocks} from "@/utils/stockHelpers";
import {valuationData} from "@/valuation";
import {decode} from "@toon-format/toon";
import {create} from "zustand";

const PULSE_DURATION = 1500; // ms - duration of pulse animation
const POLLING_INTERVAL = 10_000; // ms - interval between API calls (10 seconds)

// Pre-compute deduplicated stocks at module load time
const DEDUPED_STOCKS = validateAndDeduplicateStocks(valuationData.stocks);

interface ApiQuotesResponse {
    quotes: Quote[];
}

const mergeStocksWithQuotes = (stocks: ValuationData["stocks"], quotes: Quote[]): StockWithQuote[] => {
    const quoteMap = new Map<string, Quote>();

    quotes.forEach(quote => {
        quoteMap.set(quote.symbol, quote);
    });

    return stocks
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

interface StockDataStore {
    stocks: StockWithQuote[];
    loading: boolean;
    pulse: boolean;
    lastUpdate: string | null;
    error: Error | null;
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setPulse: (pulse: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setError: (error: Error | null) => void;
    fetchQuotes: (symbols: string, stocksData: ValuationData["stocks"]) => Promise<void>;
    startPolling: (symbols: string, stocksData: ValuationData["stocks"]) => () => void;
    retryFetch: () => void;
}

export const useStockDataStore = create<StockDataStore>((set, get) => ({
    stocks: [],
    loading: true,
    pulse: false,
    lastUpdate: null,
    error: null,

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setPulse: pulse => set({pulse}),
    setLastUpdate: lastUpdate => set({lastUpdate}),
    setError: error => set({error}),

    fetchQuotes: async (symbols, stocksData) => {
        const currentStocks = get().stocks;
        set({loading: true, error: null});
        try {
            const res = await api.get(`?symbols=${encodeURIComponent(symbols)}`);
            const decoded = decode(res.data) as unknown as ApiQuotesResponse;
            const json = decoded;

            if (!json.quotes || json.quotes.length === 0) {
                throw new Error("API 返回空數據。請稍後再試。");
            }

            const merged = mergeStocksWithQuotes(stocksData, json.quotes);
            const now = new Date();
            const formattedDate = new Intl.DateTimeFormat("zh-HK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).format(now);
            set({
                stocks: merged,
                lastUpdate: formattedDate,
                pulse: true,
                loading: false,
                error: null,
            });

            setTimeout(() => {
                set({pulse: false});
            }, PULSE_DURATION);
        } catch (e) {
            set({
                error: e instanceof Error ? e : new Error("無法載入股票數據。請檢查網絡連接。"),
                loading: false,
                stocks: currentStocks.length > 0 ? currentStocks : [],
            });
        }
    },

    retryFetch: () => {
        const {fetchQuotes} = get();
        const symbols = getUniqueSymbols(DEDUPED_STOCKS);
        fetchQuotes(symbols, DEDUPED_STOCKS);
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
