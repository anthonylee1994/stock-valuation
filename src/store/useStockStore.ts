import {create} from "zustand";
import type {StockWithQuote, Quote, ValuationData} from "../types";
import moment from "moment";

const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";

interface StockStore {
    stocks: StockWithQuote[];
    loading: boolean;
    pulse: boolean;
    lastUpdate: string | null;
    sortOrder: "asc" | "desc";
    marketFilter: "hk" | "us";
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setPulse: (pulse: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: "hk" | "us") => void;
    fetchQuotes: (symbols: string, stocksData: ValuationData["stocks"]) => Promise<void>;
    startPolling: (symbols: string, stocksData: ValuationData["stocks"]) => () => void;
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

    setSortOrder: sortOrder => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
        set({sortOrder});
    },

    setMarketFilter: marketFilter => {
        localStorage.setItem(MARKET_FILTER_KEY, marketFilter);
        set({marketFilter});
    },

    fetchQuotes: async (symbols, stocksData) => {
        set({loading: true});
        try {
            const apiUrl = import.meta.env.VITE_QUOTES_API_URL || "https://stock-prices.on99.app/quotes";
            const res = await fetch(`${apiUrl}?symbols=${encodeURIComponent(symbols)}`);
            const json = (await res.json()) as {quotes: Quote[]};
            const merged = mergeStocksWithQuotes(stocksData, json.quotes);
            set({
                stocks: merged,
                lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
                pulse: true,
                loading: false,
            });

            setTimeout(() => {
                set({pulse: false});
            }, 1500);
        } catch (e) {
            set({stocks: [], loading: false});
        }
    },

    startPolling: (symbols, stocksData) => {
        const {fetchQuotes} = get();

        fetchQuotes(symbols, stocksData);

        const interval = setInterval(() => {
            fetchQuotes(symbols, stocksData);
        }, 10_000);

        return () => {
            clearInterval(interval);
        };
    },
}));
