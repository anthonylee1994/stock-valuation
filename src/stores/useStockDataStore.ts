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

let latestQuotesRequestId = 0;
let activeQuotesAbortController: AbortController | null = null;

const mergeStocksWithQuotes = (stocks: ValuationStock[], quotes: Quote[]) => {
    const quoteMap = new Map<string, Quote>();
    const missingSymbols: string[] = [];

    quotes.forEach(quote => {
        quoteMap.set(quote.symbol, quote);
    });

    const mergedStocks = stocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) {
                missingSymbols.push(stock.symbol);
                return null;
            }
            return {
                ...stock,
                ...quote,
                ...(stock.name ? {name: stock.name} : {}),
            };
        })
        .filter((s): s is StockWithQuote => s !== null);

    return {
        stocks: mergedStocks,
        missingSymbols,
    };
};

export interface StockDataStore {
    stocks: StockWithQuote[];
    loading: boolean;
    initialLoading: boolean;
    lastUpdate: string | null;
    error: Error | null;
    warnings: string[];
    valuationStocks: ValuationStock[];
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setLastUpdate: (lastUpdate: string | null) => void;
    setError: (error: Error | null) => void;
    setWarnings: (warnings: string[]) => void;
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
    warnings: [],
    valuationStocks: [],

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setLastUpdate: lastUpdate => set({lastUpdate}),
    setError: error => set({error}),
    setWarnings: warnings => set({warnings}),
    setValuationStocks: valuationStocks => set({valuationStocks}),

    fetchValuationData: async () => {
        try {
            const data = await fetchValuationData();
            const deduped = validateAndDeduplicateStocks(data.stocks);
            set({
                valuationStocks: deduped,
                warnings: data.warnings,
            });
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
        const requestId = latestQuotesRequestId + 1;
        latestQuotesRequestId = requestId;

        activeQuotesAbortController?.abort();
        const abortController = new AbortController();
        activeQuotesAbortController = abortController;
        set({loading: true, error: null});

        try {
            const res = await api.get(`?symbols=${encodeURIComponent(symbols)}`, {
                signal: abortController.signal,
            });
            const decoded = decode(res.data) as unknown as ApiQuotesResponse;
            const json = decoded;

            if (!json.quotes || json.quotes.length === 0) {
                throw new Error("API 返回空數據。請稍後再試。");
            }

            if (requestId !== latestQuotesRequestId) {
                return;
            }

            const merged = mergeStocksWithQuotes(valuationStocks, json.quotes);
            const now = new Date();
            const formattedDate = moment(now).fromNow();
            const warnings = [...get().warnings.filter(warning => !warning.startsWith("部分報價缺失："))];

            if (merged.missingSymbols.length > 0) {
                warnings.push(`部分報價缺失：${merged.missingSymbols.join(", ")}`);
            }

            set({
                stocks: merged.stocks,
                lastUpdate: formattedDate,
                loading: false,
                initialLoading: false,
                error: null,
                warnings,
            });
        } catch (e) {
            if (abortController.signal.aborted || requestId !== latestQuotesRequestId) {
                return;
            }

            set({
                error: e instanceof Error ? e : new Error("無法載入股票數據。請檢查網絡連接。"),
                loading: false,
                initialLoading: false,
            });
        } finally {
            if (activeQuotesAbortController === abortController) {
                activeQuotesAbortController = null;
            }
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
            activeQuotesAbortController?.abort();
        };
    },
}));
