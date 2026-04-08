import {POLLING_INTERVAL} from "@/constants/stockConstants";
import type {ApiQuotesResponse, Quote, StockWithQuote, ValuationStock} from "@/types";
import {api} from "@/utils/api";
import {getUniqueSymbols, validateAndDeduplicateStocks} from "@/utils/stockHelpers";
import {fetchValuationData} from "@/valuation";
import {decode} from "@toon-format/toon";
import moment from "moment";
// @ts-expect-error - moment locale files don't have type definitions
import "moment/dist/locale/zh-hk";
import {create} from "zustand";

const mergeStocksWithQuotes = (stocks: ValuationStock[], quotes: Quote[]): StockWithQuote[] => {
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
                ...(stock.name ? {name: stock.name} : {}),
            };
        })
        .filter((s): s is StockWithQuote => s !== null);
};

export interface StockDataStore {
    stocks: StockWithQuote[];
    loading: boolean;
    initialLoading: boolean;
    lastUpdate: string | null;
    error: Error | null;
    valuationStocks: ValuationStock[];
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setError: (error: Error | null) => void;
    setValuationStocks: (stocks: ValuationStock[]) => void;
    fetchValuationData: () => Promise<void>;
    fetchQuotes: () => Promise<void>;
    startPolling: () => () => void;
    retryFetch: () => void;
}

export const useStockDataStore = create<StockDataStore>((set, get) => ({
    stocks: [],
    loading: true,
    initialLoading: true,
    lastUpdate: null,
    error: null,
    valuationStocks: [],

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setLastUpdate: lastUpdate => set({lastUpdate}),
    setError: error => set({error}),
    setValuationStocks: valuationStocks => set({valuationStocks}),

    fetchValuationData: async () => {
        try {
            const data = await fetchValuationData();
            const deduped = validateAndDeduplicateStocks(data.stocks);
            set({valuationStocks: deduped});
        } catch (e) {
            console.error("Failed to fetch valuation data:", e);
            set({
                error: e instanceof Error ? e : new Error("無法載入估值數據"),
                loading: false,
                initialLoading: false,
            });
        }
    },

    fetchQuotes: async () => {
        const {valuationStocks} = get();

        if (valuationStocks.length === 0) {
            return;
        }

        const symbols = getUniqueSymbols(valuationStocks);
        const currentStocks = get().stocks;
        set({loading: true, error: null});

        try {
            const res = await api.get(`?symbols=${encodeURIComponent(symbols)}`);
            const decoded = decode(res.data) as unknown as ApiQuotesResponse;
            const json = decoded;

            if (!json.quotes || json.quotes.length === 0) {
                throw new Error("API 返回空數據。請稍後再試。");
            }

            const merged = mergeStocksWithQuotes(valuationStocks, json.quotes);
            const now = new Date();
            const formattedDate = moment(now).fromNow();
            set({
                stocks: merged,
                lastUpdate: formattedDate,
                loading: false,
                initialLoading: false,
                error: null,
            });
        } catch (e) {
            set({
                error: e instanceof Error ? e : new Error("無法載入股票數據。請檢查網絡連接。"),
                loading: false,
                initialLoading: false,
                stocks: currentStocks.length > 0 ? currentStocks : [],
            });
        }
    },

    retryFetch: () => {
        const {fetchValuationData, fetchQuotes, valuationStocks} = get();

        if (valuationStocks.length === 0) {
            void fetchValuationData().then(() => {
                const {valuationStocks: latestValuationStocks} = get();
                if (latestValuationStocks.length > 0) {
                    void fetchQuotes();
                }
            });
            return;
        }

        void fetchQuotes();
    },

    startPolling: () => {
        const {fetchQuotes} = get();

        fetchQuotes();

        const interval = setInterval(() => {
            if (!document.hidden) {
                fetchQuotes();
            }
        }, POLLING_INTERVAL);

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchQuotes();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    },
}));
